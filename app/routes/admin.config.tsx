import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { getEnv } from "~/lib/env.server";
import { getDb, siteConfig, type SiteConfig } from "~/lib/db.server";

interface LoaderData {
  config: SiteConfig | null;
}

interface ActionData {
  success?: boolean;
  error?: string;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context);
  
  // Handle local dev without D1 binding
  if (!env.DB) {
    return json<LoaderData>({ config: null });
  }
  
  const db = getDb(env.DB);

  const configRows = await db.select().from(siteConfig).limit(1);

  return json<LoaderData>({
    config: configRows[0] || null,
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = getEnv(context);
  
  // Handle local dev without D1 binding
  if (!env.DB) {
    return json<ActionData>(
      { error: "Database not available. Run with 'wrangler dev' for full functionality." },
      { status: 503 }
    );
  }
  
  const db = getDb(env.DB);

  const formData = await request.formData();
  const businessName = formData.get("businessName");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const address = formData.get("address");
  const primaryColor = formData.get("primaryColor");
  const seoDescription = formData.get("seoDescription");

  try {
    // Check if config exists
    const existing = await db.select().from(siteConfig).limit(1);

    if (existing.length > 0) {
      // Update existing config
      await db
        .update(siteConfig)
        .set({
          businessName: businessName as string,
          phone: phone as string || null,
          email: email as string || null,
          address: address as string || null,
          primaryColor: primaryColor as string || "#4f46e5",
          seoDescription: seoDescription as string || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(siteConfig.id, existing[0].id));
    } else {
      // Insert new config
      await db.insert(siteConfig).values({
        businessName: businessName as string,
        phone: phone as string || null,
        email: email as string || null,
        address: address as string || null,
        primaryColor: primaryColor as string || "#4f46e5",
        seoDescription: seoDescription as string || null,
      });
    }

    return json<ActionData>({ success: true });
  } catch (error) {
    console.error("Failed to save config:", error);
    return json<ActionData>(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

export default function AdminConfig() {
  const { config } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-2 text-slate-900">Site Configuration</h2>
        <p className="text-body">Manage your business information and branding.</p>
      </div>

      <div className="card p-6 md:p-8">
        <Form method="post" className="space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              required
              defaultValue={config?.businessName || "EdgeShop Consulting"}
              className="input"
              placeholder="Your Business Name"
            />
          </div>

          {/* Two column layout for contact info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={config?.phone || ""}
                className="input"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Business Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={config?.email || ""}
                className="input"
                placeholder="hello@example.com"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
              Business Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={config?.address || ""}
              className="input"
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-slate-700 mb-2">
              Brand Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                defaultValue={config?.primaryColor || "#4f46e5"}
                className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
              />
              <span className="text-sm text-slate-500">
                Choose your primary brand color
              </span>
            </div>
          </div>

          {/* SEO Description */}
          <div>
            <label htmlFor="seoDescription" className="block text-sm font-medium text-slate-700 mb-2">
              SEO Description
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              defaultValue={config?.seoDescription || ""}
              className="input resize-none"
              placeholder="A brief description of your business for search engines (150-160 characters recommended)"
            />
            <p className="mt-1 text-sm text-slate-500">
              This appears in search engine results below your page title.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
