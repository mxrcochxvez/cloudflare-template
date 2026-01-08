import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { 
  ArrowLeft, 
  Square, 
  Layout, 
  Type, 
  Palette, 
  Image, 
  Loader2, 
  SplitSquareVertical, 
  Bell,
  Columns
} from "lucide-react";

// Components
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";
import { Container } from "~/components/ui/container";
import { Grid } from "~/components/ui/grid";

export const meta: MetaFunction = () => {
  return [
    { title: "Component Library | Cloudflare Remix Template" },
    { name: "description", content: "Documentation for all UI components" },
  ];
};

const components = [
  { id: "button", name: "Button", icon: Square, category: "Primitives" },
  { id: "card", name: "Card", icon: Layout, category: "Primitives" },
  { id: "input", name: "Input", icon: Type, category: "Primitives" },
  { id: "badge", name: "Badge", icon: Palette, category: "Primitives" },
  { id: "avatar", name: "Avatar", icon: Image, category: "Primitives" },
  { id: "skeleton", name: "Skeleton", icon: Loader2, category: "Primitives" },
  { id: "separator", name: "Separator", icon: SplitSquareVertical, category: "Primitives" },
  { id: "alert", name: "Alert", icon: Bell, category: "Feedback" },
  { id: "grid", name: "Grid", icon: Columns, category: "Layout" },
];

export default function DocsComponents() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <Container>
          <div className="py-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-2">Component Library</h1>
            <p className="text-xl text-muted-foreground">
              Accessible, customizable components built with Radix UI and Tailwind CSS.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex gap-12 py-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-6">
              {["Primitives", "Feedback", "Layout"].map((category) => (
                <div key={category}>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">{category}</h3>
                  <nav className="space-y-1">
                    {components.filter(c => c.category === category).map((comp) => (
                      <a 
                        key={comp.id} 
                        href={`#${comp.id}`} 
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                      >
                        <comp.icon className="h-4 w-4" />
                        {comp.name}
                      </a>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-16">

            {/* BUTTON */}
            <section id="button" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Button</h2>
              <p className="text-muted-foreground mb-6">A clickable button with multiple variants and sizes.</p>
              
              <Card className="mb-4">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </CardContent>
              </Card>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Button } from "~/components/ui/button"

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* CARD */}
            <section id="card" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Card</h2>
              <p className="text-muted-foreground mb-6">A container with header, content, and footer sections.</p>
              
              <Card className="mb-4 max-w-md">
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>This is a card description.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Card content goes here.</p>
                </CardContent>
              </Card>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* INPUT */}
            <section id="input" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Input</h2>
              <p className="text-muted-foreground mb-6">A styled form input field.</p>
              
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    <Input placeholder="Email" className="max-w-xs" />
                    <Input type="password" placeholder="Password" className="max-w-xs" />
                    <Input disabled placeholder="Disabled" className="max-w-xs" />
                  </div>
                </CardContent>
              </Card>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Input } from "~/components/ui/input"

<Input placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* BADGE */}
            <section id="badge" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Badge</h2>
              <p className="text-muted-foreground mb-6">Small status indicators.</p>
              
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="destructive">Error</Badge>
                  </div>
                </CardContent>
              </Card>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Badge } from "~/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* AVATAR */}
            <section id="avatar" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Avatar</h2>
              <p className="text-muted-foreground mb-6">User profile image with fallback.</p>
              
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">SC</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="bg-violet-500 text-white">MJ</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="bg-emerald-500 text-white">ER</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Avatar, AvatarFallback } from "~/components/ui/avatar"

<Avatar>
  <AvatarFallback>SC</AvatarFallback>
</Avatar>`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* SKELETON */}
            <section id="skeleton" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Skeleton</h2>
              <p className="text-muted-foreground mb-6">Loading placeholder animations.</p>
              
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex gap-6 items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Skeleton } from "~/components/ui/skeleton"

<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-12 w-12 rounded-full" />`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* SEPARATOR */}
            <section id="separator" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Separator</h2>
              <p className="text-muted-foreground mb-6">Visual divider between content.</p>
              
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>Content above</div>
                    <Separator />
                    <div>Content below</div>
                  </div>
                </CardContent>
              </Card>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Separator } from "~/components/ui/separator"

<Separator />`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* ALERT */}
            <section id="alert" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Alert</h2>
              <p className="text-muted-foreground mb-6">Callouts for important information.</p>
              
              <div className="space-y-4 mb-4">
                <Alert variant="info">
                  <AlertTitle>Info</AlertTitle>
                  <AlertDescription>Informational message.</AlertDescription>
                </Alert>
                <Alert variant="success">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Operation completed successfully.</AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>Please review before continuing.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Something went wrong.</AlertDescription>
                </Alert>
              </div>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert"

<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed.</AlertDescription>
</Alert>`}
                </pre>
              </details>
            </section>

            <Separator />

            {/* GRID */}
            <section id="grid" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-2">Grid</h2>
              <p className="text-muted-foreground mb-6">Responsive grid layout component.</p>
              
              <Grid cols={3} gap="md" className="mb-4">
                <div className="bg-muted p-4 rounded text-center">Item 1</div>
                <div className="bg-muted p-4 rounded text-center">Item 2</div>
                <div className="bg-muted p-4 rounded text-center">Item 3</div>
              </Grid>

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  View Code
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Grid } from "~/components/ui/grid"

<Grid cols={3} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>`}
                </pre>
              </details>
            </section>

            {/* Back to top */}
            <div className="text-center pt-8">
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>

          </main>
        </div>
      </Container>
    </div>
  );
}
