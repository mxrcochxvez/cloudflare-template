import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { 
  BookOpen, 
  Palette,
  Database,
  Rocket,
  ArrowRight,
  Code2,
  Layers
} from "lucide-react";
import { Container } from "~/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export const meta: MetaFunction = () => {
  return [
    { title: "Documentation | Cloudflare Remix Template" },
    { name: "description", content: "Learn how to use the Cloudflare Remix Template" },
  ];
};

export default function DocsIndex() {
  const sections = [
    {
      title: "Component Library",
      description: "19+ accessible, customizable UI components built with Radix UI and Tailwind CSS.",
      icon: Palette,
      href: "/docs/components",
      badge: "12 documented",
    },
    {
      title: "Database Setup",
      description: "Learn how to set up Drizzle ORM with Cloudflare D1 for type-safe database queries.",
      icon: Database,
      href: "/admin/settings",
      badge: "Drizzle ORM",
    },
    {
      title: "Deployment",
      description: "Deploy your app to Cloudflare Workers in minutes with zero configuration.",
      icon: Rocket,
      href: "https://github.com/mxrcochxvez/cloudflare-template",
      external: true,
      badge: "GitHub",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <Container>
          <div className="py-16 text-center">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn the Template
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build production-ready applications with Remix and Cloudflare Workers.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {sections.map((section) => (
              <Link 
                key={section.title}
                to={section.href} 
                target={section.external ? "_blank" : undefined}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {section.badge}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center text-sm text-primary font-medium">
                      Learn more
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Getting Started */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Code2 className="w-6 h-6" />
              Quick Start
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Clone the template</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>git clone https://github.com/mxrcochxvez/cloudflare-template.git my-app</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Install dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`cd my-app
npm install`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Start developing</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>npm run dev</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-4">
                    Open <code className="bg-muted px-1.5 py-0.5 rounded">http://localhost:5173</code> to see your app.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. Deploy to Cloudflare</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>npm run deploy</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-4">
                    Your app will be live on Cloudflare Workers in seconds.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Link to="/docs/components">
                <Button size="lg" className="gap-2">
                  <Layers className="w-5 h-5" />
                  Explore Components
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
