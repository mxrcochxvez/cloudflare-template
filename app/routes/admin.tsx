import { Outlet } from "@remix-run/react";
import { Sidebar } from "~/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <main className="md:pl-64 transition-all duration-300">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
