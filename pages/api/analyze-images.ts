
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import type { Fields, Files, File } from "formidable";
import { promises as fs } from "fs";

// To use real OpenAI API, set MOCK_OPENAI=false in your environment (e.g. .env.local or Vercel dashboard)
// To use mock/demo mode, set MOCK_OPENAI=true or run in development (NODE_ENV=development)
// The frontend will work seamlessly with either mode.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MOCK_MODE = process.env.MOCK_OPENAI === "true" || process.env.NODE_ENV === "development";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to call OpenAI Vision API (GPT-4o) or return mock
// In mock mode, always returns a generic response. In production, calls OpenAI API with image and question.
async function analyzeImageWithOpenAI(imageBuffer: Buffer, question: string, mock: boolean): Promise<string> {
  if (mock) {
    return "Mock LLM response: Image analyzed successfully.";
  }
  const base64Image = imageBuffer.toString("base64");
  const payload = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: question },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 400,
  };
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key.");
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API error: ${error}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response.";
}

/**
 * API Route: /api/analyze-images
 * Accepts multipart/form-data POST with:
 *   - images: 1-4 image files
 *   - question: string
 *
 * In mock mode, returns a generic mock response for demo purposes.
 * In production mode, sends images and question to OpenAI GPT-4o Vision API and returns the LLM response.
 *
 * To switch modes, set MOCK_OPENAI in your environment.
 *
 * Frontend integration: simply POST images and question to this endpoint.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const form = formidable({ multiples: true });
    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const question = Array.isArray(fields["question"]) ? fields["question"][0] : fields["question"];
    let images: File[] = [];
    const fileField = files["images"];
    if (Array.isArray(fileField)) {
      images = fileField;
    } else if (fileField) {
      images = [fileField];
    }

    if (!question || images.length === 0) {
      res.status(400).json({ error: "Missing question or images." });
      return;
    }

    let results;
    if (MOCK_MODE) {
      // Always return a generic mock response
      results = [{ response: "Mock LLM response: Images analyzed successfully." }];
    } else {
      results = await Promise.all(
        images.map(async (img: File) => {
          const buffer = await fs.readFile(img.filepath);
          const response = await analyzeImageWithOpenAI(buffer, question, false);
          return { response };
        })
      );
    }

    res.status(200).json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(500).json({ error: message });
  }
}
