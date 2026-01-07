import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getEnv } from "~/lib/env.server";

export interface AIGenerateRequest {
  businessDescription: string;
  industry?: string;
  businessName?: string;
}

export interface AIGenerateResponse {
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  services: { title: string; description: string }[];
  seoDescription: string;
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const env = getEnv(context);
  
  if (!env.AI) {
    return json({ 
      error: "AI not available. Enable Workers AI in your Cloudflare dashboard." 
    }, { status: 503 });
  }

  try {
    const body = await request.json() as AIGenerateRequest;
    const { businessDescription, industry, businessName } = body;

    if (!businessDescription || businessDescription.length < 10) {
      return json({ 
        error: "Please provide a more detailed business description (at least 10 characters)." 
      }, { status: 400 });
    }

    const prompt = `You are a marketing copywriter helping create website content.

Based on this business information, generate marketing content:

Business Name: ${businessName || "Not specified"}
Industry: ${industry || "Not specified"}
Description: ${businessDescription}

Generate the following (respond ONLY with valid JSON, no markdown):
{
  "tagline": "A catchy tagline, max 8 words",
  "heroHeadline": "A compelling headline for the hero section, max 10 words",
  "heroSubheadline": "A persuasive subheadline, 2 sentences max",
  "services": [
    {"title": "Service 1 name", "description": "1 sentence description"},
    {"title": "Service 2 name", "description": "1 sentence description"},
    {"title": "Service 3 name", "description": "1 sentence description"}
  ],
  "seoDescription": "An SEO meta description, max 160 characters"
}`;

    const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: "You are a helpful marketing copywriter. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });

    // Extract response text
    const responseText = typeof response === "string" 
      ? response 
      : (response as { response?: string }).response || "";

    // Try to parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from AI response:", responseText);
      return json({ 
        error: "Failed to parse AI response. Please try again." 
      }, { status: 500 });
    }

    const generated = JSON.parse(jsonMatch[0]) as AIGenerateResponse;
    
    return json<AIGenerateResponse>(generated);
  } catch (error) {
    console.error("AI generation error:", error);
    return json({ 
      error: "Failed to generate content. Please try again." 
    }, { status: 500 });
  }
}
