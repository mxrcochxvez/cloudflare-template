import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { 
  Zap, 
  Database, 
  Palette, 
  Shield, 
  ArrowRight, 
  Layers,
  Globe,
  Code2,
  Rocket,
  Heart,
  Star,
  Compass,
  Lightbulb,
  Target,
  Cpu,
  MousePointerClick
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { Section } from "~/components/ui/section";
import { Grid } from "~/components/ui/grid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => {
  return [
    { title: "Cloudflare Remix Template | Build Beautiful Apps at the Edge" },
    { 
      name: "description", 
      content: "A stunning, production-ready template for building modern web applications with Remix, Cloudflare Workers, and a beautiful component library." 
    },
  ];
};

export default function Index() {
  return (
    <>
      {/* =====================================================================
          CHAPTER 1: THE VISION
          An immersive hero that captures imagination
      ======================================================================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Stars field */}
        <div className="absolute inset-0">
          {/* Small stars */}
          {[...Array(80)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-px h-px bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
          {/* Medium stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-m-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
          {/* Bright stars */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`star-b-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                boxShadow: '0 0 4px 1px rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        {/* Distant nebula - subtle color accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-900/15 rounded-full blur-[100px]" />

        {/* Planet/Moon element */}
        <div className="absolute top-20 right-[15%] w-16 h-16 rounded-full bg-slate-700 shadow-[inset_-4px_-4px_12px_rgba(0,0,0,0.8),inset_2px_2px_8px_rgba(255,255,255,0.1)]" />
        <div className="absolute bottom-32 left-[8%] w-8 h-8 rounded-full bg-slate-600 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.8)]" />

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Version badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 text-sm mb-10">
              <span>Remix + Cloudflare</span>
              <span className="text-white/30">•</span>
              <span className="text-amber-400 font-medium">v1.0.0</span>
            </div>

            {/* Epic headline with gradient */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              <span className="text-white">Where</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                ideas take flight
              </span>
            </h1>

            {/* Poetic subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              A meticulously designed foundation for crafting exceptional web experiences. 
              Built for dreamers, designed for builders.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="https://github.com/mxrcochxvez/cloudflare-template" target="_blank">
                <Button size="lg" className="text-lg px-8 h-14 bg-white text-slate-900 hover:bg-slate-100">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/docs/components">
                <Button size="lg" className="text-lg px-8 h-14 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20">
                  <Compass className="mr-2 h-5 w-5" />
                  Explore Components
                </Button>
              </Link>
            </div>

            {/* Visual storytelling - what you're building toward */}
            <div className="relative max-w-3xl mx-auto">
              {/* Glowing frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-cyan-500/50 rounded-2xl blur-xl opacity-50" />
              
              {/* Browser mockup */}
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-slate-800 text-xs text-slate-400">
                      your-amazing-app.workers.dev
                    </div>
                  </div>
                </div>
                
                {/* Preview content */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-8 rounded-lg bg-slate-800" />
                    <Skeleton className="w-32 h-8 rounded-lg bg-slate-800" />
                    <Skeleton className="flex-1 h-8 rounded-lg bg-slate-800" />
                  </div>
                  <Skeleton className="w-full h-32 rounded-lg bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50" />
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-20 rounded-lg bg-slate-800" />
                    <Skeleton className="h-20 rounded-lg bg-slate-800" />
                    <Skeleton className="h-20 rounded-lg bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Scroll invitation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-white/40 text-sm tracking-widest uppercase">Discover</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* =====================================================================
          CHAPTER 2: THE PHILOSOPHY
          What makes this special
      ======================================================================== */}
      <Section size="xl" className="relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <Container className="relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4" />
              Our Philosophy
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Built on first
              <br />
              <span className="text-primary">principles</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every decision was intentional. Every component, crafted with purpose. 
              This isn't just a template—it's a foundation for excellence.
            </p>
          </div>

          {/* Philosophy cards - more artistic layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PhilosophyCard
              icon={Target}
              number="01"
              title="Edge-Native"
              description="Deploy globally on Cloudflare's network. Your users get sub-50ms latency, wherever they are in the world."
              gradient="from-cyan-500 to-blue-500"
            />
            <PhilosophyCard
              icon={Palette}
              number="02"
              title="Design-First"
              description="Components that don't just work—they delight. Every shadow, every transition, every detail matters."
              gradient="from-violet-500 to-purple-500"
            />
            <PhilosophyCard
              icon={Code2}
              number="03"
              title="Developer Joy"
              description="TypeScript everywhere. Hot reload. Intuitive APIs. Building should feel like creating art."
              gradient="from-fuchsia-500 to-pink-500"
            />
            <PhilosophyCard
              icon={Shield}
              number="04"
              title="Battle-Tested"
              description="Built on Radix UI primitives. Accessible by default. Production-ready from day one."
              gradient="from-emerald-500 to-green-500"
            />
            <PhilosophyCard
              icon={Layers}
              number="05"
              title="Composable"
              description="Mix, match, and customize. Your code, your rules. We give you the building blocks."
              gradient="from-amber-500 to-orange-500"
            />
            <PhilosophyCard
              icon={Cpu}
              number="06"
              title="Future-Ready"
              description="D1 databases, AI bindings, KV storage—the entire Cloudflare platform at your fingertips."
              gradient="from-rose-500 to-red-500"
            />
          </div>
        </Container>
      </Section>

      {/* =====================================================================
          CHAPTER 3: THE TOOLKIT
          Interactive component showcase
      ======================================================================== */}
      <Section id="components" variant="muted" size="xl" className="relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <Container className="relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <MousePointerClick className="w-4 h-4" />
              Your Toolkit
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Components that
              <br />
              <span className="text-primary">tell stories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              19+ carefully crafted components. Each one designed to help you build 
              interfaces that connect with your users on a deeper level.
            </p>
          </div>

          {/* Story-driven component showcase */}
          <div className="space-y-24">
            
            {/* STORY 1: The Launch Moment */}
            <div>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Story 1</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">The Launch Moment</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Your app is ready. With one click, you deploy to the edge. 
                  Here's what that moment looks like.
                </p>
              </div>
              
              <Card className="max-w-2xl mx-auto">
                <div className="bg-slate-900 p-6 border-b">
                  <div className="flex items-center gap-3 mb-4">
                    <ComponentDemo name="Avatar">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-emerald-500 text-white">YU</AvatarFallback>
                      </Avatar>
                    </ComponentDemo>
                    <div>
                      <p className="text-white font-medium">Your App</p>
                      <p className="text-slate-400 text-sm">Ready to deploy</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ComponentDemo name="Button">
                      <Button className="bg-emerald-500 hover:bg-emerald-600">
                        <Rocket className="mr-2 h-4 w-4" />
                        Deploy to Edge
                      </Button>
                    </ComponentDemo>
                    <ComponentDemo name="Button variant='outline'">
                      <Button variant="outline" className="text-white border-slate-500 bg-slate-800 hover:bg-slate-700">
                        Preview
                      </Button>
                    </ComponentDemo>
                  </div>
                </div>
                <CardContent className="pt-6 space-y-4">
                  <ComponentDemo name="Alert variant='success'">
                    <Alert variant="success">
                      <AlertTitle>Deployed to 300+ edge locations</AlertTitle>
                      <AlertDescription>
                        Your app is now live at your-app.workers.dev — globally available in under 50ms.
                      </AlertDescription>
                    </Alert>
                  </ComponentDemo>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Build time: 4.2s</span>
                    <ComponentDemo name="Badge variant='success'">
                      <Badge variant="success">Live</Badge>
                    </ComponentDemo>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* STORY 2: The Team Dashboard */}
            <div>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Story 2</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">The Team Behind It</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Every great product is built by a team. Here's how you showcase yours.
                </p>
              </div>
              
              <Grid cols={3} gap="lg" className="max-w-4xl mx-auto">
                <ComponentDemo name="Card">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <Avatar className="h-16 w-16 mx-auto mb-4">
                        <AvatarFallback className="bg-violet-500 text-white text-lg">SC</AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold">Sarah Chen</h4>
                      <p className="text-sm text-muted-foreground mb-4">Lead Engineer</p>
                      <p className="text-sm text-muted-foreground">
                        "This template lets us ship in days, not weeks."
                      </p>
                    </CardContent>
                  </Card>
                </ComponentDemo>
                <ComponentDemo name="Card">
                  <Card className="text-center border-primary">
                    <CardContent className="pt-6">
                      <Avatar className="h-16 w-16 mx-auto mb-4">
                        <AvatarFallback className="bg-amber-500 text-white text-lg">MJ</AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold">Marcus Johnson</h4>
                      <p className="text-sm text-muted-foreground mb-4">Product Lead</p>
                      <p className="text-sm text-muted-foreground">
                        "The components feel premium out of the box."
                      </p>
                    </CardContent>
                  </Card>
                </ComponentDemo>
                <ComponentDemo name="Card">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <Avatar className="h-16 w-16 mx-auto mb-4">
                        <AvatarFallback className="bg-cyan-500 text-white text-lg">ER</AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold">Emily Rodriguez</h4>
                      <p className="text-sm text-muted-foreground mb-4">Design Lead</p>
                      <p className="text-sm text-muted-foreground">
                        "Finally, a template that respects good design."
                      </p>
                    </CardContent>
                  </Card>
                </ComponentDemo>
              </Grid>
            </div>

            {/* STORY 3: The User Journey */}
            <div>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Story 3</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">The Customer Journey</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  A user discovers your product, signs up, and becomes a customer. 
                  Every touchpoint matters.
                </p>
              </div>
              
              <div className="max-w-xl mx-auto space-y-6">
                <ComponentDemo name="Alert variant='info'">
                  <Alert variant="info">
                    <AlertTitle>Welcome to the waitlist! 🎉</AlertTitle>
                    <AlertDescription>
                      You're #847 in line. We'll notify you when it's your turn.
                    </AlertDescription>
                  </Alert>
                </ComponentDemo>
                
                <ComponentDemo name="Card + Input + Button">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create your account</CardTitle>
                      <CardDescription>Join 10,000+ developers building on the edge</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="you@company.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <Button className="w-full">Create Account</Button>
                      <p className="text-xs text-center text-muted-foreground">
                        By signing up, you agree to our Terms of Service
                      </p>
                    </CardContent>
                  </Card>
                </ComponentDemo>
                
                <ComponentDemo name="Alert variant='success'">
                  <Alert variant="success">
                    <AlertTitle>You're in! 🚀</AlertTitle>
                    <AlertDescription>
                      Check your email to verify your account and get started.
                    </AlertDescription>
                  </Alert>
                </ComponentDemo>
              </div>
            </div>

            {/* STORY 4: The Dashboard Moment */}
            <div>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Story 4</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">The Dashboard</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Your users log in and see their data. Make it beautiful.
                </p>
              </div>
              
              <Card className="max-w-4xl mx-auto">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Analytics</CardTitle>
                      <CardDescription>Last 30 days performance</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <ComponentDemo name="Button size='sm'">
                        <Button size="sm" variant="outline">Export</Button>
                      </ComponentDemo>
                      <ComponentDemo name="Button size='sm'">
                        <Button size="sm">Share</Button>
                      </ComponentDemo>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Grid cols={4} gap="md">
                    <ComponentDemo name="Card (stat)">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Page Views</p>
                        <p className="text-2xl font-bold">24,521</p>
                        <Badge variant="success" className="mt-2">+12.5%</Badge>
                      </div>
                    </ComponentDemo>
                    <ComponentDemo name="Card (stat)">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Users</p>
                        <p className="text-2xl font-bold">1,429</p>
                        <Badge variant="success" className="mt-2">+8.2%</Badge>
                      </div>
                    </ComponentDemo>
                    <ComponentDemo name="Card (stat)">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Bounce Rate</p>
                        <p className="text-2xl font-bold">32.1%</p>
                        <Badge variant="warning" className="mt-2">-2.4%</Badge>
                      </div>
                    </ComponentDemo>
                    <ComponentDemo name="Card (stat)">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Avg. Session</p>
                        <p className="text-2xl font-bold">4m 32s</p>
                        <Badge variant="success" className="mt-2">+18.7%</Badge>
                      </div>
                    </ComponentDemo>
                  </Grid>
                </CardContent>
              </Card>
            </div>

          </div>
        </Container>
      </Section>

      {/* =====================================================================
          CHAPTER 4: THE PROOF
          Social proof and testimonials
      ======================================================================== */}
      <Section size="xl">
        <Container>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Loved by Builders
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              What creators
              <br />
              <span className="text-primary">are saying</span>
            </h2>
          </div>

          <Grid cols={3} gap="lg">
            <TestimonialCard
              quote="This template saved me weeks of setup. The components are gorgeous and the DX is unmatched."
              author="Sarah Chen"
              role="Full Stack Developer"
              avatar="SC"
            />
            <TestimonialCard
              quote="Finally, a Cloudflare template that feels premium. Production-ready from the first commit."
              author="Marcus Johnson"
              role="Engineering Lead"
              avatar="MJ"
            />
            <TestimonialCard
              quote="The attention to design detail is remarkable. Every component feels crafted with intention."
              author="Emily Rodriguez"
              role="Design Engineer"
              avatar="ER"
            />
          </Grid>
        </Container>
      </Section>

      {/* =====================================================================
          CHAPTER 5: THE BEGINNING
          Final call to action
      ======================================================================== */}
      <Section size="xl" className="relative overflow-hidden">
        {/* Epic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white mb-8">
              <Rocket className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Your story
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                starts now
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Every great product began with a single step. This template is yours—
              take it, shape it, make it extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="https://github.com/mxrcochxvez/cloudflare-template" target="_blank">
                <Button size="lg" className="text-lg px-10 h-14 bg-white text-slate-900 hover:bg-gray-100 shadow-2xl shadow-white/20">
                  Use This Template
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" className="text-lg px-10 h-14 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20">
                  Explore Demo
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

// Tooltip wrapper for showcasing component names
function ComponentDemo({ 
  name, 
  children 
}: { 
  name: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="group/demo relative">
      {children}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover/demo:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
        <code>{name}</code>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
}

function PhilosophyCard({
  icon: Icon,
  number,
  title,
  description,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`} />
      <CardContent className="pt-8">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-4xl font-bold text-muted-foreground/20">{number}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <Card className="p-8">
        {children}
      </Card>
    </div>
  );
}

function PricingCard({
  tier,
  price,
  description,
  features,
  color,
  featured = false,
}: {
  tier: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  featured?: boolean;
}) {
  return (
    <Card className={`relative overflow-hidden flex flex-col h-full ${featured ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
      {featured && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
          Popular
        </div>
      )}
      <div className={`h-1 ${color}`} />
      <CardHeader>
        <CardTitle className="text-lg">{tier}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Free" && price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ul className="space-y-2 flex-grow">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className={`w-full mt-6 ${featured ? 'bg-primary' : ''}`} variant={featured ? "default" : "outline"}>
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  avatar,
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-8">
        <div className="absolute -top-2 left-6 text-6xl text-primary/20 font-serif">"</div>
        <p className="text-muted-foreground mb-6 relative z-10 leading-relaxed">{quote}</p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{author}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
