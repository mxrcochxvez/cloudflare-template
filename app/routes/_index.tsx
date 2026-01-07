import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { getEnv } from "~/lib/env.server";
import { getDb, menuItems, leads, siteConfig, type MenuItem } from "~/lib/db.server";
import { ServiceCard } from "~/components/ServiceCard";
import { ContactForm } from "~/components/ContactForm";

/**
 * Loader data type for the landing page
 */
interface LoaderData {
  services: MenuItem[];
  config: {
    businessName: string;
    seoDescription: string | null;
  };
}

/**
 * Action response type for form submission
 */
interface ActionData {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.config.businessName || "Hexacomb";
  const description = data?.config.seoDescription || 
    "Building your digital hive. Efficient web development, cloud architecture, and AI integration for small businesses.";

  return [
    { title: `${title} | Building Your Digital Hive` },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { tagName: "link", rel: "canonical", href: "/" },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context);
  
  // Handle local dev without D1 binding
  if (!env.DB) {
    return json<LoaderData>({
      services: [],
      config: {
        businessName: "EdgeShop Consulting",
        seoDescription: null,
      },
    });
  }
  
  const db = getDb(env.DB);

  // Fetch active menu items
  const services = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isActive, true))
    .orderBy(menuItems.sortOrder);

  // Fetch site config (first row)
  const configRows = await db.select().from(siteConfig).limit(1);
  const config = configRows[0] || {
    businessName: "Hexacomb Consulting",
    seoDescription: null,
  };

  return json<LoaderData>({
    services,
    config: {
      businessName: config.businessName,
      seoDescription: config.seoDescription,
    },
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = getEnv(context);
  
  // Handle local dev without D1 binding
  if (!env.DB) {
    return json<ActionData>(
      { error: "Database not available. Run with 'wrangler pages dev' to test form submissions." },
      { status: 503 }
    );
  }
  
  const db = getDb(env.DB);

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");

  // Validate required fields
  const fieldErrors: ActionData["fieldErrors"] = {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    fieldErrors.name = "Name must be at least 2 characters";
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    fieldErrors.email = "Please enter a valid email address";
  }

  if (!message || typeof message !== "string" || message.trim().length < 10) {
    fieldErrors.message = "Message must be at least 10 characters";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return json<ActionData>({ fieldErrors }, { status: 400 });
  }

  try {
    // Insert lead into database
    await db.insert(leads).values({
      name: (name as string).trim(),
      email: (email as string).trim(),
      phone: phone && typeof phone === "string" ? phone.trim() : null,
      message: (message as string).trim(),
      status: "new",
    });

    return json<ActionData>({ success: true });
  } catch (error) {
    console.error("Failed to save lead:", error);
    return json<ActionData>(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

export default function Index() {
  const { services } = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900" style={{ boxShadow: 'inset 0 -80px 100px -60px rgba(245, 158, 11, 0.15), inset 0 60px 100px -60px rgba(0, 0, 0, 0.5)' }}>
        {/* Honeycomb pattern background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        
        <div className="container-custom relative py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <span className="badge-primary mb-6">
              Building Your Digital Hive
            </span>
            <h1 className="heading-1 text-white mb-6">
              Efficient Solutions,{" "}
              <span className="text-gradient">Sweet Results</span>
            </h1>
            <p className="text-lg md:text-xl text-amber-100/80 mb-8 leading-relaxed">
              Like a well-organized hive, we build technology solutions that work 
              together seamlessly. Web development, cloud infrastructure, and AI 
              integration all working in harmony for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary text-center">
                Start Your Project
              </a>
              <a href="#services" className="btn-outline border-primary-400 text-primary-300 hover:bg-primary-500/10 text-center">
                Explore Services
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </section>

      {/* Trust indicators */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">0ms</p>
              <p className="text-small">Cold Start Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">99.9%</p>
              <p className="text-small">Uptime Guarantee</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">24/7</p>
              <p className="text-small">Support Available</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">100+</p>
              <p className="text-small">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section bg-white relative">
        {/* Subtle honeycomb background */}
        <div className="absolute inset-0 bg-honeycomb opacity-30" aria-hidden="true" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-primary mb-4">Our Services</span>
            <h2 className="heading-2 text-slate-900 mb-4">
              The Hive of Solutions
            </h2>
            <p className="text-body">
              Each cell in our hive serves a purpose. From web development to AI 
              integration, we build interconnected solutions that make your business buzz.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Placeholder cards when no services exist */}
              {[
                { title: "Web Development", description: "Responsive, lightning-fast websites that capture and convert visitors.", category: "Websites", icon: "web" },
                { title: "Cloud Architecture", description: "Scalable infrastructure that grows as your colony expands.", category: "Infrastructure", icon: "cloud" },
                { title: "AI Integration", description: "Smart automation that works tirelessly, like a hive mind for your business.", category: "Innovation", icon: "ai" },
              ].map((placeholder, index) => (
                <article key={index} className="card p-6 bg-white/80 backdrop-blur-sm">
                  <div className="w-14 h-14 mb-4 relative">
                    {/* Hexagon shape */}
                    <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
                      <path
                        d="M20 2L36.5 11V29L20 38L3.5 29V11L20 2Z"
                        fill="url(#serviceGrad)"
                        stroke="#d97706"
                        strokeWidth="1"
                      />
                      <defs>
                        <linearGradient id="serviceGrad" x1="3.5" y1="2" x2="36.5" y2="38" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#fef3c7" />
                          <stop offset="1" stopColor="#fde68a" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        {placeholder.icon === "web" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        )}
                        {placeholder.icon === "cloud" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        )}
                        {placeholder.icon === "ai" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        )}
                      </svg>
                    </div>
                  </div>
                  <span className="badge-primary text-xs mb-3">{placeholder.category}</span>
                  <h3 className="heading-3 text-slate-900 mb-2">{placeholder.title}</h3>
                  <p className="text-body text-sm">{placeholder.description}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-amber-50/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left column - Info */}
            <div>
              <span className="badge-primary mb-4">Get in Touch</span>
              <h2 className="heading-2 text-slate-900 mb-4">
                Let's Build Your Hive Together
              </h2>
              <p className="text-body mb-8">
                Ready to see sweet results? Fill out the form and a member of our 
                colony will get back to you within 24 hours with a free consultation.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email Us</h3>
                    <p className="text-slate-600">hello@hexacomb.dev</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Call Us</h3>
                    <p className="text-slate-600">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Response Time</h3>
                    <p className="text-slate-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Form */}
            <div className="bg-white rounded-2xl shadow-md border border-primary-100 p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
