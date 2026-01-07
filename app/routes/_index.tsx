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
  const title = data?.config.businessName || "EdgeShop Consulting";
  const description = data?.config.seoDescription || 
    "Professional consulting services for small businesses. We help you grow with modern technology solutions.";

  return [
    { title: `${title} | Expert Solutions for Your Business` },
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
    businessName: "EdgeShop Consulting",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        
        <div className="container-custom relative py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <span className="badge-primary mb-6">
              🚀 Lightning-Fast Solutions
            </span>
            <h1 className="heading-1 text-white mb-6">
              Transform Your Business with{" "}
              <span className="text-gradient">Modern Technology</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              We help small businesses leverage cutting-edge technology to streamline 
              operations, reach more customers, and scale with confidence. No complexity, 
              just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary text-center">
                Get a Free Consultation
              </a>
              <a href="#services" className="btn-outline border-white text-white hover:bg-white/10 text-center">
                View Our Services
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
      <section id="services" className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-primary mb-4">Our Services</span>
            <h2 className="heading-2 text-slate-900 mb-4">
              Solutions Tailored to Your Needs
            </h2>
            <p className="text-body">
              From web development to cloud infrastructure, we provide comprehensive 
              solutions to help your business thrive in the digital age.
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
                { title: "Web Development", description: "Fast, responsive websites built with modern technology.", category: "Development" },
                { title: "Cloud Solutions", description: "Scalable infrastructure that grows with your business.", category: "Infrastructure" },
                { title: "AI Integration", description: "Smart automation to streamline your workflows.", category: "Innovation" },
              ].map((placeholder, index) => (
                <article key={index} className="card p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
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
      <section id="contact" className="section bg-slate-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left column - Info */}
            <div>
              <span className="badge-primary mb-4">Get in Touch</span>
              <h2 className="heading-2 text-slate-900 mb-4">
                Let's Build Something Great Together
              </h2>
              <p className="text-body mb-8">
                Ready to transform your business? Fill out the form and we'll get back 
                to you within 24 hours with a free consultation.
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
                    <p className="text-slate-600">hello@edgeshop.dev</p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
