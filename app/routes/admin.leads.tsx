import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";

import { getEnv } from "~/lib/env.server";
import { getDb, leads, type Lead } from "~/lib/db.server";

interface LoaderData {
  leads: Lead[];
}

export async function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context);
  
  // Handle local dev without D1 binding
  if (!env.DB) {
    return json<LoaderData>({ leads: [] });
  }
  
  const db = getDb(env.DB);

  const allLeads = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));

  return json<LoaderData>({ leads: allLeads });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = getEnv(context);
  
  // Handle local dev without D1 binding
  if (!env.DB) {
    return json({ error: "Database not available." }, { status: 503 });
  }
  
  const db = getDb(env.DB);

  const formData = await request.formData();
  const leadId = formData.get("leadId");
  const newStatus = formData.get("status");

  if (!leadId || !newStatus) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await db
      .update(leads)
      .set({ status: newStatus as Lead["status"] })
      .where(eq(leads.id, Number(leadId)));

    return json({ success: true });
  } catch (error) {
    console.error("Failed to update lead:", error);
    return json({ error: "Failed to update lead" }, { status: 500 });
  }
}

function StatusBadge({ status }: { status: Lead["status"] }) {
  const styles: Record<Lead["status"], string> = {
    new: "badge-primary",
    contacted: "badge-warning",
    converted: "badge-success",
    archived: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={styles[status] || "badge-primary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const navigation = useNavigation();
  const isUpdating = navigation.state === "submitting" && 
    navigation.formData?.get("leadId") === String(lead.id);

  return (
    <tr className={`hover:bg-slate-50 ${isUpdating ? "opacity-50" : ""}`}>
      <td className="px-6 py-4">
        <div>
          <span className="font-medium text-slate-900">{lead.name}</span>
          <p className="text-sm text-slate-500">{lead.email}</p>
          {lead.phone && <p className="text-sm text-slate-400">{lead.phone}</p>}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-600 max-w-md truncate">{lead.message}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Form method="post" className="flex gap-2">
          <input type="hidden" name="leadId" value={lead.id} />
          <select
            name="status"
            defaultValue={lead.status}
            onChange={(e) => e.target.form?.requestSubmit()}
            className="text-sm border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            aria-label="Update lead status"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="archived">Archived</option>
          </select>
        </Form>
      </td>
    </tr>
  );
}

export default function AdminLeads() {
  const { leads: allLeads } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-2 text-slate-900">All Leads</h2>
        <p className="text-body">Manage and track your contact form submissions.</p>
      </div>

      <div className="card overflow-hidden">
        {allLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allLeads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg
              className="w-12 h-12 text-slate-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-slate-500">No leads yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Leads will appear here when visitors submit the contact form.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
