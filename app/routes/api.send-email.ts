import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email via Resend API
 * Requires RESEND_API_KEY secret: wrangler secret put RESEND_API_KEY
 */
export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Get API key from environment
  const apiKey = (context.cloudflare?.env as Record<string, string>)?.RESEND_API_KEY;
  
  if (!apiKey) {
    return json({ 
      error: "Resend not configured. Run: wrangler secret put RESEND_API_KEY" 
    }, { status: 503 });
  }

  try {
    const body = await request.json() as SendEmailRequest;
    const { to, subject, html, from = "onboarding@resend.dev" } = body;

    if (!to || !subject || !html) {
      return json({ error: "Missing required fields: to, subject, html" }, { status: 400 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return json({ error: "Failed to send email" }, { status: 500 });
    }

    const result = await response.json();
    return json({ success: true, id: (result as { id: string }).id });
  } catch (error) {
    console.error("Email send error:", error);
    return json({ error: "Failed to send email" }, { status: 500 });
  }
}

/**
 * Helper to send lead notification email
 */
export async function sendLeadNotification(
  apiKey: string,
  notificationEmail: string,
  lead: { name: string; email: string; phone?: string | null; message: string }
) {
  const html = `
    <h2>New Lead Received</h2>
    <p><strong>Name:</strong> ${lead.name}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${lead.message}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "leads@resend.dev",
      to: notificationEmail,
      subject: `New Lead: ${lead.name}`,
      html,
    }),
  });

  return response.ok;
}
