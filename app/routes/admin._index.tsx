import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { desc, sql } from "drizzle-orm";

import { getEnv } from "~/lib/env.server";
import { getDb, leads, type Lead } from "~/lib/db.server";

interface LoaderData {
  recentLeads: Lead[];
  stats: {
    total: number;
    newCount: number;
    contactedCount: number;
    convertedCount: number;
  };
}

export async function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context);
  
  // Handle local dev without D1 binding
  if (!env.DB) {
    return json<LoaderData>({
      recentLeads: [],
      stats: { total: 0, newCount: 0, contactedCount: 0, convertedCount: 0 },
    });
  }
  
  const db = getDb(env.DB);

  // Fetch recent leads
  const recentLeads = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(10);

  // Fetch stats
  const statsResult = await db
    .select({
      total: sql<number>`count(*)`,
      newCount: sql<number>`sum(case when status = 'new' then 1 else 0 end)`,
      contactedCount: sql<number>`sum(case when status = 'contacted' then 1 else 0 end)`,
      convertedCount: sql<number>`sum(case when status = 'converted' then 1 else 0 end)`,
    })
    .from(leads);

  const stats = statsResult[0] || {
    total: 0,
    newCount: 0,
    contactedCount: 0,
    convertedCount: 0,
  };

  return json<LoaderData>({
    recentLeads,
    stats: {
      total: Number(stats.total) || 0,
      newCount: Number(stats.newCount) || 0,
      contactedCount: Number(stats.contactedCount) || 0,
      convertedCount: Number(stats.convertedCount) || 0,
    },
  });
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

export default function AdminDashboard() {
  const { recentLeads, stats } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-2 text-slate-900">Dashboard</h2>
        <p className="text-body">Overview of your leads and site performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-sm text-slate-500 mb-1">Total Leads</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-500 mb-1">New</p>
          <p className="text-3xl font-bold text-primary-600">{stats.newCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-500 mb-1">Contacted</p>
          <p className="text-3xl font-bold text-amber-600">{stats.contactedCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-500 mb-1">Converted</p>
          <p className="text-3xl font-bold text-green-600">{stats.convertedCount}</p>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="card">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="heading-3">Recent Leads</h3>
          <Link to="/admin/leads" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-900">{lead.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
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
