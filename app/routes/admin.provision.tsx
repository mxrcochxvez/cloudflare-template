import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";

import { getEnv } from "~/lib/env.server";
import { getDb, siteConfig } from "~/lib/db.server";

export const meta: MetaFunction = () => [
  { title: "Provisioning | Admin" },
  { name: "robots", content: "noindex" },
];

export async function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context);
  
  // This page only works with DB binding
  if (!env.DB) {
    return json({ 
      status: "no_db",
      message: "No D1 database binding found. Create the database first.",
    });
  }
  
  const db = getDb(env.DB);
  
  try {
    const existing = await db.select().from(siteConfig).limit(1);
    const config = existing[0];
    
    if (!config) {
      return json({ 
        status: "no_config",
        message: "No configuration found. Tables may need to be created.",
      });
    }
    
    if (config.setupComplete) {
      return redirect("/");
    }
    
    return json({ 
      status: "pending",
      config: {
        businessName: config.businessName,
        email: config.email,
      },
    });
  } catch (error) {
    return json({ 
      status: "error",
      message: "Database tables not found. Run migrations first.",
    });
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = getEnv(context);
  
  if (!env.DB) {
    return json({ error: "No database binding" }, { status: 503 });
  }
  
  const db = getDb(env.DB);
  const formData = await request.formData();
  const action = formData.get("_action");
  
  if (action === "confirm") {
    try {
      // Mark setup as complete
      await db.update(siteConfig).set({
        setupComplete: true,
        updatedAt: new Date().toISOString(),
      });
      
      return redirect("/");
    } catch (error) {
      console.error("Provision confirmation error:", error);
      return json({ error: "Failed to update configuration" });
    }
  }
  
  return json({ error: "Invalid action" });
}

export default function ProvisionPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Provisioning Confirmation
          </h1>
          
          {data.status === "no_db" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-red-800 mb-2">Database Not Connected</h3>
              <p className="text-sm text-red-700 mb-3">
                The D1 database binding is not available. Please run:
              </p>
              <code className="block bg-red-100 p-2 rounded text-xs font-mono text-red-900">
                wrangler d1 create cloudflare-template-db
              </code>
              <p className="text-sm text-red-700 mt-3">
                Then update <code>wrangler.toml</code> with the database ID and redeploy.
              </p>
            </div>
          )}
          
          {data.status === "error" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-amber-800 mb-2">Migrations Needed</h3>
              <p className="text-sm text-amber-700 mb-3">
                Database tables don't exist. Please run migrations:
              </p>
              <code className="block bg-amber-100 p-2 rounded text-xs font-mono text-amber-900">
                wrangler d1 execute cloudflare-template-db --remote --file=./drizzle/0000_initial.sql
              </code>
            </div>
          )}
          
          {data.status === "no_config" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-amber-800 mb-2">No Configuration</h3>
              <p className="text-sm text-amber-700">
                Tables exist but no config found. The customer may need to complete the setup wizard.
              </p>
            </div>
          )}
          
          {data.status === "pending" && (
            <>
              <p className="text-slate-600 mb-4">
                A customer has completed the setup wizard. Confirm when you have:
              </p>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-500 mb-1">Business Name</p>
                <p className="font-medium text-slate-900">{"config" in data ? data.config?.businessName : "Unknown"}</p>
                {"config" in data && data.config?.email && (
                  <>
                    <p className="text-sm text-slate-500 mb-1 mt-3">Contact Email</p>
                    <p className="font-medium text-slate-900">{data.config?.email}</p>
                  </>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded" required />
                  <span className="text-sm text-slate-700">
                    D1 database created and connected
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded" required />
                  <span className="text-sm text-slate-700">
                    Migrations applied
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded" />
                  <span className="text-sm text-slate-700">
                    RESEND_API_KEY secret set (optional)
                  </span>
                </label>
              </div>
              
              {actionData?.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
                  {actionData.error}
                </div>
              )}
              
              <Form method="post">
                <input type="hidden" name="_action" value="confirm" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? "Activating..." : "Confirm & Activate Site"}
                </button>
              </Form>
            </>
          )}
        </div>
        
        <p className="text-center text-sm text-slate-500 mt-4">
          This page is only accessible to administrators.
        </p>
      </div>
    </div>
  );
}
