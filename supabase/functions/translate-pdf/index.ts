import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

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

    // Create new bilingual PDF
    const translatedPdfBuffer = await createBilingualPDF(sentences, translations);
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

async function createBilingualPDF(englishSentences: string[], arabicTranslations: string[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  let page = pdfDoc.addPage([595, 842]); // A4 size
  let yPosition = 780;
  const margin = 50;
  const lineHeight = 20;
  const maxWidth = 495; // 595 - 2*margin
  
  for (let i = 0; i < englishSentences.length; i++) {
    const english = englishSentences[i].trim();
    const arabic = arabicTranslations[i]?.trim() || "";
    
    // Check if we need a new page
    if (yPosition < 100) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = 780;
    }
    
    // Draw English text (left-to-right)
    page.drawText(english, {
      x: margin,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
      maxWidth: maxWidth,
    });
    
    yPosition -= lineHeight;
    
    // Draw Arabic text (right-to-left) - Note: pdf-lib has limited RTL support
    // For production, consider using a library with better Arabic support
    page.drawText(arabic, {
      x: margin,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
      color: rgb(0.2, 0.2, 0.2),
      maxWidth: maxWidth,
    });
    
    yPosition -= lineHeight + 5; // Extra spacing between pairs
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
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
