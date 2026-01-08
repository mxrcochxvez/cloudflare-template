import * as React from "react";
import { Link, useLocation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Container } from "./container";
import { Button } from "./button";
import { Menu, X, Github } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  external?: boolean;
}

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Brand/logo text
   */
  brand?: string;
  /**
   * Navigation items
   */
  items?: NavItem[];
  /**
   * Whether to show GitHub link
   */
  githubUrl?: string;
}

const defaultItems: NavItem[] = [
  { title: "Docs", href: "/docs" },
  { title: "Components", href: "/docs/components" },
  { title: "Admin", href: "/admin" },
];

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      brand = "Cloudflare Template",
      items = defaultItems,
      githubUrl,
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          className
        )}
        {...props}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-primary">⚡</span>
              {brand}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.href ||
                      location.pathname.startsWith(item.href + "/")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
            </nav>

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href ||
                      location.pathname.startsWith(item.href + "/")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          )}
        </Container>
      </header>
    );
  }
);
Navbar.displayName = "Navbar";

export { Navbar };
