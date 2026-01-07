import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getEnv } from "~/lib/env.server";

/**
 * Request body for the AI polish endpoint
 */
interface PolishRequest {
  text: string;
}

/**
 * Response from the AI polish endpoint
 */
interface PolishResponse {
  polished: string;
  originalLength: number;
  polishedLength: number;
}

/**
 * Error response structure
 */
interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * POST /api/ai-polish
 * 
 * Accepts raw text and returns a marketing-polished version using Llama-3.
 * 
 * Example usage:
 * ```typescript
 * const response = await fetch('/api/ai-polish', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ text: 'We sell good coffee' })
 * });
 * const { polished } = await response.json();
 * // polished: "Experience our artisanal, hand-crafted coffee..."
 * ```
 */
export async function action({ request, context }: ActionFunctionArgs) {
  // Only accept POST requests
  if (request.method !== "POST") {
    return json<ErrorResponse>(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  // Parse request body
  let body: PolishRequest;
  try {
    body = await request.json();
  } catch {
    return json<ErrorResponse>(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Validate input
  const { text } = body;
  if (!text || typeof text !== "string") {
    return json<ErrorResponse>(
      { error: "Missing required field: text" },
      { status: 400 }
    );
  }

  if (text.length > 2000) {
    return json<ErrorResponse>(
      { error: "Text too long. Maximum 2000 characters." },
      { status: 400 }
    );
  }

  if (text.trim().length === 0) {
    return json<ErrorResponse>(
      { error: "Text cannot be empty" },
      { status: 400 }
    );
  }

  const env = getEnv(context);

  try {
    // Call Llama-3 via Workers AI
    const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        {
          role: "system",
          content: `You are a professional marketing copywriter for a small business. 
            Your task is to take rough, informal text and transform it into polished, 
            engaging marketing copy that:
            - Maintains the original meaning and key information
            - Uses persuasive, benefit-focused language
            - Is concise yet compelling
            - Sounds professional but approachable
            - Is suitable for a website, menu, or promotional material

            Only respond with the polished text, nothing else.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 500,
    });

    // Extract the response text
    const polishedText = 
      typeof aiResponse === "object" && "response" in aiResponse
        ? (aiResponse as { response: string }).response
        : String(aiResponse);

    return json<PolishResponse>({
      polished: polishedText.trim(),
      originalLength: text.length,
      polishedLength: polishedText.trim().length,
    });
  } catch (error) {
    console.error("AI polish error:", error);
    
    // Return a user-friendly error
    return json<ErrorResponse>(
      {
        error: "Failed to process text with AI",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Reject other HTTP methods
export function loader() {
  return json<ErrorResponse>(
    { error: "Use POST method to polish text" },
    { status: 405 }
  );
}
