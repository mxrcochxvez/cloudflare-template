import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "Pending Setup | Cloudflare Template" },
  { name: "robots", content: "noindex" },
];

// Admin email - configure this for your deployment
const ADMIN_EMAIL = "admin@example.com";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const businessName = url.searchParams.get("name") || "New Business";
  const customerEmail = url.searchParams.get("email") || "";
  
  return json({ businessName, customerEmail });
}

export default function SetupPending() {
  const { businessName, customerEmail } = useLoaderData<typeof loader>();
  
  // Generate email content
  const subject = encodeURIComponent(`Provisioning Request: ${businessName}`);
  
  const body = encodeURIComponent(`
Hi,

A new site setup has been submitted and is waiting for provisioning.

BUSINESS DETAILS
----------------
Name: ${businessName}
Email: ${customerEmail || "Not provided"}

REQUIRED ACTIONS
----------------
1. Create D1 database:
   wrangler d1 create cloudflare-template-db

2. Update wrangler.toml with the database_id

3. Run migrations:
   wrangler d1 execute cloudflare-template-db --remote --file=./drizzle/0000_initial.sql

4. (Optional) Set Resend API key:
   wrangler secret put RESEND_API_KEY

5. Confirm provisioning at:
   https://your-domain.com/admin/provision

Thanks!
`);

  const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Setup Complete!
        </h1>
        
        <p className="text-slate-600 mb-6">
          Your configuration for <strong>{businessName}</strong> has been saved.
          The site administrator needs to provision the resources before your site goes live.
        </p>
        
        {/* Mailto Button */}
        <a
          href={mailtoUrl}
          className="btn-primary inline-flex items-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Provisioning Request
        </a>
        
        <p className="text-sm text-slate-500">
          This will open your email client with the required commands pre-filled.
        </p>
        
        {/* Status Card */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left">
          <h3 className="font-semibold text-slate-900 mb-3">What happens next?</h3>
          <ol className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">1</span>
              <span>Administrator receives provisioning request</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">2</span>
              <span>Database and resources are created</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">3</span>
              <span>Administrator confirms at <code className="bg-slate-100 px-1 rounded">/admin/provision</code></span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600 shrink-0">✓</span>
              <span>Your site goes live!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
