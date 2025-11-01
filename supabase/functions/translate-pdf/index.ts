import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, fileName, fileBase64 } = await req.json();

    console.log("Processing PDF:", fileName);

    let pdfUint8: Uint8Array;
    if (fileBase64) {
      pdfUint8 = decodeBase64(fileBase64);
    } else if (fileUrl) {
      const pdfResponse = await fetch(fileUrl);
      if (!pdfResponse.ok) {
        throw new Error("Failed to download PDF");
      }
      const pdfBuffer = await pdfResponse.arrayBuffer();
      pdfUint8 = new Uint8Array(pdfBuffer);
    } else {
      throw new Error("Either fileBase64 or fileUrl is required");
    }

    // Extract text from PDF
    const pdfData = await extractTextFromPDF(pdfUint8);
    console.log("Extracted text length:", pdfData.text.length);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error("No text found in PDF");
    }

    // Split text into sentences for bilingual translation
    const sentences = pdfData.text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    console.log(`Processing ${sentences.length} sentences`);

    // Translate sentences using Lovable AI
    const translations = await translateSentences(sentences);
    console.log("Translation completed");

    // Create new bilingual PDF (simple)
    const translatedPdfBuffer = await createSimpleBilingualPDF(sentences, translations);
    const translatedBase64 = encodeBase64(translatedPdfBuffer);

    return new Response(
      JSON.stringify({ translatedBase64, fileName: `translated_${fileName || 'document.pdf'}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in translate-pdf function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function extractTextFromPDF(pdfBuffer: Uint8Array): Promise<{ text: string; metadata: any }> {
  // Simple PDF text extraction
  const decoder = new TextDecoder();
  let text = decoder.decode(pdfBuffer);
  
  // Extract text between stream objects (simplified approach)
  const textMatches = text.match(/\(([^)]+)\)/g);
  let extractedText = "";
  
  if (textMatches) {
    extractedText = textMatches
      .map(match => match.slice(1, -1))
      .join(" ")
      .replace(/\\/g, "")
      .trim();
  }

  // If no text found with simple method, try another approach
  if (!extractedText) {
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
    let match;
    while ((match = streamRegex.exec(text)) !== null) {
      const streamContent = match[1];
      // Try to extract readable text
      const readable = streamContent.replace(/[^\x20-\x7E\u0600-\u06FF]/g, " ").trim();
      if (readable.length > 10) {
        extractedText += readable + " ";
      }
    }
  }

  return {
    text: extractedText || "No text could be extracted from PDF",
    metadata: { pages: 1 }
  };
}

async function translateSentences(sentences: string[]): Promise<string[]> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  const translations: string[] = [];
  
  // Process in batches of 10 sentences
  const batchSize = 10;
  for (let i = 0; i < sentences.length; i += batchSize) {
    const batch = sentences.slice(i, i + batchSize);
    const batchText = batch.join("\n===SENTENCE_SEPARATOR===\n");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional translator. Translate each English sentence to Arabic. Keep the same number of sentences separated by ===SENTENCE_SEPARATOR===. Only return the translated sentences without any additional comments."
          },
          {
            role: "user",
            content: batchText
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Translation API error:", response.status, errorText);
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();
    const translatedBatch = data.choices[0].message.content.split("===SENTENCE_SEPARATOR===");
    translations.push(...translatedBatch.map((t: string) => t.trim()));
  }

  return translations;
}

async function createSimpleBilingualPDF(englishSentences: string[], arabicTranslations: string[]): Promise<Uint8Array> {
  // Very simple PDF builder using Type1 Helvetica (Arabic shaping not supported)
  // We still generate bilingual lines; we'll improve font/RTL later
  const escape = (s: string) => s.replace(/[()\\]/g, "\\$&");
  const lines: string[] = [];
  for (let i = 0; i < englishSentences.length; i++) {
    const en = englishSentences[i]?.trim() || "";
    const ar = arabicTranslations[i]?.trim() || "";
    if (en) lines.push(`(${escape(en)}) Tj 0 -15 Td`);
    if (ar) lines.push(`(${escape(ar)}) Tj 0 -20 Td`);
    lines.push(`( ) Tj 0 -10 Td`); // extra spacing between pairs
  }

  const contentStream = `BT\n/F1 12 Tf\n50 750 Td\n${lines.join("\n")}\nET`;
  const textLength = contentStream.length;

  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources << /Font << /F1 5 0 R >> >>
>>
endobj
4 0 obj
<< /Length ${textLength} >>
stream
${contentStream}
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000${(400 + textLength).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${450 + textLength}
%%EOF`;

  return new TextEncoder().encode(pdfContent);
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
