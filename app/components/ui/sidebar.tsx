import * as React from "react";
import { Link, useLocation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "./button";

export interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Navigation items
   */
  items?: SidebarItem[];
  /**
   * App/brand title
   */
  title?: string;
  /**
   * Whether sidebar is collapsible
   */
  collapsible?: boolean;
}

const defaultItems: SidebarItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Content", href: "/admin/content", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      items = defaultItems,
      title = "Admin",
      collapsible = true,
      ...props
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();

    return (
      <>
        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          ref={ref}
          className={cn(
            "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
            collapsed ? "w-16" : "w-64",
            mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!collapsed && (
              <span className="font-semibold text-lg">{title}</span>
            )}
            {collapsible && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1 p-2">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>
      </>
    );
  }
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
