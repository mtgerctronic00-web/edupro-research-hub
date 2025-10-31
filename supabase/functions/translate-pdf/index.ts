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

    // Translate text using Lovable AI
    const translatedText = await translateText(pdfData.text);
    console.log("Translation completed");

    // Create new PDF with translated text
    const translatedPdfBuffer = await createPDFWithText(translatedText, pdfData.metadata);
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

async function translateText(text: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  // Split text into chunks if too long (max ~4000 chars per chunk)
  const maxChunkSize = 4000;
  const chunks = [];
  
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.slice(i, i + maxChunkSize));
  }

  console.log(`Translating ${chunks.length} chunks`);

  const translatedChunks = [];
  
  for (const chunk of chunks) {
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
            content: "You are a professional translator. Translate the following English text to Arabic. Maintain the original meaning and structure. Only return the translated text without any additional comments."
          },
          {
            role: "user",
            content: chunk
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
    const translated = data.choices[0].message.content;
    translatedChunks.push(translated);
  }

  return translatedChunks.join("\n\n");
}

async function createPDFWithText(text: string, metadata: any): Promise<Uint8Array> {
  // Create a simple PDF with the translated text
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
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length ${text.length + 100}
>>
stream
BT
/F1 12 Tf
50 750 Td
${text.split('\n').map(line => `(${line.replace(/[()\\]/g, '\\$&')}) Tj 0 -15 Td`).join('\n')}
ET
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
0000000${(400 + text.length).toString().padStart(3, '0')} 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${450 + text.length}
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
