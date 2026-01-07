import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { getEnv } from "~/lib/env.server";
import { getDb, menuItems, leads, type MenuItem } from "~/lib/db.server";
import { ServiceCard } from "~/components/ServiceCard";
import { ContactForm } from "~/components/ContactForm";
import { useBranding, type BrandingConfig } from "~/context/BrandingContext";

interface LoaderData {
  services: MenuItem[];
}

interface ActionData {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
}

export const meta: MetaFunction = () => {
  // Meta is handled by root loader
  return [];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context);
  
  if (!env.DB) {
    return json<LoaderData>({ services: [] });
  }
  
  const db = getDb(env.DB);
  
  const services = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isActive, true))
    .orderBy(menuItems.sortOrder);

  return json<LoaderData>({ services });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = getEnv(context);
  
  if (!env.DB) {
    return json<ActionData>(
      { error: "Database not available." },
      { status: 503 }
    );
  }
  
  const db = getDb(env.DB);
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");

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
  const branding = useBranding();

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{ backgroundColor: branding.secondaryColor }}
      >
        <div className="container-custom relative py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            {branding.tagline && (
              <span className="badge-primary mb-6">
                {branding.tagline}
              </span>
            )}
            <h1 className="heading-1 text-white mb-6">
              {branding.heroHeadline || `Welcome to ${branding.businessName}`}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              {branding.heroSubheadline || branding.description || "We help businesses succeed with professional solutions."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="btn-primary text-center"
                style={{ backgroundColor: branding.primaryColor }}
              >
                Get Started
              </a>
              <a 
                href="#services" 
                className="btn-outline border-white text-white hover:bg-white/10 text-center"
              >
                View Services
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </section>

      {/* Trust indicators */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold" style={{ color: branding.primaryColor }}>Fast</p>
              <p className="text-small">Response Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: branding.primaryColor }}>99.9%</p>
              <p className="text-small">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: branding.primaryColor }}>24/7</p>
              <p className="text-small">Support</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: branding.primaryColor }}>100+</p>
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
              What We Offer
            </h2>
            <p className="text-body">
              Professional solutions tailored to your needs.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No services configured yet.</p>
              <p className="text-sm mt-2">Add services in the admin panel.</p>
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
                Contact Us
              </h2>
              <p className="text-body mb-8">
                Ready to get started? Fill out the form and we'll get back to you shortly.
              </p>

              <div className="space-y-6">
                {branding.email && (
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${branding.primaryColor}20` }}
                    >
                      <svg className="w-5 h-5" style={{ color: branding.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Email</h3>
                      <p className="text-slate-600">{branding.email}</p>
                    </div>
                  </div>
                )}

                {branding.phone && (
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${branding.primaryColor}20` }}
                    >
                      <svg className="w-5 h-5" style={{ color: branding.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Phone</h3>
                      <p className="text-slate-600">{branding.phone}</p>
                    </div>
                  </div>
                )}

                {branding.address && (
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${branding.primaryColor}20` }}
                    >
                      <svg className="w-5 h-5" style={{ color: branding.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Address</h3>
                      <p className="text-slate-600">{branding.address}</p>
                    </div>
                  </div>
                )}
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
