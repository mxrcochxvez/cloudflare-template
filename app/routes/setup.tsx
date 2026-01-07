import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import { getEnv } from "~/lib/env.server";
import { getDb, siteConfig } from "~/lib/db.server";

export const meta: MetaFunction = () => [
  { title: "Setup | Cloudflare Template" },
  { name: "robots", content: "noindex" },
];

export async function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context);
  
  // LOCAL DEV: No setup needed, redirect to home
  if (!env.DB) {
    console.log("📦 Local dev mode: Skipping setup wizard");
    return redirect("/");
  }
  
  const db = getDb(env.DB);
  
  try {
    const existing = await db.select().from(siteConfig).limit(1);
    if (existing[0]?.setupComplete) {
      return redirect("/");
    }
  } catch {
    // Table might not exist - that's fine, show setup
  }
  
  return json({ dbAvailable: true });
}

interface ActionData {
  success?: boolean;
  error?: string;
  step?: number;
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = getEnv(context);
  
  if (!env.DB) {
    return json<ActionData>({ 
      error: "Database not available. Please create a D1 database first." 
    });
  }
  
  const db = getDb(env.DB);
  const formData = await request.formData();
  
  // Get all form values
  const businessName = formData.get("businessName") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const industry = formData.get("industry") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const secondaryColor = formData.get("secondaryColor") as string;
  
  const productSchema = formData.get("productSchema") as string;

  if (!businessName) {
    return json<ActionData>({ error: "Business name is required" });
  }
  
  try {
    // Check if config exists
    const existing = await db.select().from(siteConfig).limit(1);
    
    const configData = {
      businessName,
      tagline: tagline || null,
      description: description || null,
      industry: industry || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      primaryColor: primaryColor || "#0ea5e9",
      secondaryColor: secondaryColor || "#1e293b",
      resendConfigured: Boolean(formData.get("enableEmail")),
      productSchema: productSchema || null,
      // NOT complete - waiting for admin to provision
      setupComplete: false,
      updatedAt: new Date().toISOString(),
    };
    
    if (existing.length > 0) {
      await db.update(siteConfig).set(configData);
    } else {
      await db.insert(siteConfig).values(configData);
    }
    
    // Redirect to pending page with business info for email
    const params = new URLSearchParams({
      name: businessName,
      email: email || "",
    });
    return redirect(`/setup/pending?${params.toString()}`);
  } catch (error) {
    console.error("Setup error:", error);
    return json<ActionData>({ 
      error: "Failed to save configuration. Make sure the database tables exist." 
    });
  }
}

const industries = [
  { value: "consulting", label: "Consulting / Professional Services" },
  { value: "agency", label: "Creative Agency" },
  { value: "restaurant", label: "Restaurant / Food Service" },
  { value: "retail", label: "Retail / E-commerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

const colorPresets = [
  { name: "Sky Blue", primary: "#0ea5e9", secondary: "#1e293b" },
  { name: "Emerald", primary: "#10b981", secondary: "#1e293b" },
  { name: "Violet", primary: "#8b5cf6", secondary: "#1e293b" },
  { name: "Rose", primary: "#f43f5e", secondary: "#1e293b" },
  { name: "Amber", primary: "#f59e0b", secondary: "#1e293b" },
  { name: "Slate", primary: "#64748b", secondary: "#0f172a" },
];

export default function Setup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    description: "",
    industry: "",
    email: "",
    phone: "",
    address: "",
    primaryColor: "#0ea5e9",
    secondaryColor: "#1e293b",
    enableEmail: false,
    resendApiKey: "", 
    productSchema: [] as { name: string; type: "text" | "number" | "boolean"; required: boolean }[],
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const generateContent = async () => {
    if (formData.description.length < 10) {
      setAiError("Please enter a longer description first (at least 10 chars)");
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessDescription: formData.description,
          industry: formData.industry,
          businessName: formData.businessName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || "Failed to generate content");
      }

      const generated = data as any;

      setFormData(prev => ({
        ...prev,
        tagline: generated.tagline || prev.tagline,
        // We could also populate other fields if we added them to the form (hero, etc)
      }));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const canProceed = step === 1 ? formData.businessName.length >= 2 : true;
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container-custom">
          <h1 className="text-xl font-bold text-slate-900">Site Setup</h1>
        </div>
      </header>
      
      {/* Progress */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => {
              // Hide step 5 if not retail
              if (s === 5 && formData.industry !== "retail") return null;
              
              return (
                <div key={s} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      s === step 
                        ? "bg-primary-500 text-white" 
                        : s < step 
                          ? "bg-green-500 text-white"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  {(s < (formData.industry === "retail" ? 5 : 4)) && (
                    <div className={`w-12 h-1 mx-2 ${s < step ? "bg-green-500" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-2 text-sm text-slate-600">
            <span className={step === 1 ? "font-medium text-slate-900" : ""}>Business Info</span>
            <span className={step === 2 ? "font-medium text-slate-900" : ""}>Contact</span>
            <span className={step === 3 ? "font-medium text-slate-900" : ""}>Branding</span>
            <span className={step === 4 ? "font-medium text-slate-900" : ""}>Email</span>
            {formData.industry === "retail" && (
              <span className={step === 5 ? "font-medium text-slate-900" : ""}>Schema</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <main className="flex-1 container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <Form method="post">
            {/* Hidden fields for all data */}
            <input type="hidden" name="productSchema" value={JSON.stringify(formData.productSchema)} />
            {Object.entries(formData).map(([key, value]) => {
              if (key === "productSchema") return null;
              return <input key={key} type="hidden" name={key} value={value as string} />;
            })}
            
            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="card p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="heading-3 text-slate-900 mb-2">Tell us about your business</h2>
                  <p className="text-body text-sm">This information will be displayed throughout your site.</p>
                </div>
                
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className="input"
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-slate-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    className="input"
                    placeholder="Your success is our mission"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="input resize-none"
                    rows={3}
                    placeholder="Brief description of what your business does..."
                  />
                  <div className="mt-2 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={generateContent}
                      disabled={isGenerating || formData.description.length < 10}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>✨ Auto-fill with AI</>
                      )}
                    </button>
                    {aiError && <span className="text-sm text-red-500">{aiError}</span>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    className="input"
                  >
                    <option value="">Select an industry...</option>
                    {industries.map((ind) => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            {/* Step 2: Contact */}
            {step === 2 && (
              <div className="card p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="heading-3 text-slate-900 mb-2">Contact Information</h2>
                  <p className="text-body text-sm">How can customers reach you?</p>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="input"
                    placeholder="hello@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="input"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="input"
                    placeholder="123 Main St, City, ST 12345"
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Branding */}
            {step === 3 && (
              <div className="card p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="heading-3 text-slate-900 mb-2">Choose Your Colors</h2>
                  <p className="text-body text-sm">Select a color scheme for your site.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Color Presets
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          updateField("primaryColor", preset.primary);
                          updateField("secondaryColor", preset.secondary);
                        }}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          formData.primaryColor === preset.primary
                            ? "border-slate-900"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span className="text-xs font-medium">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={formData.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="input flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-slate-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={(e) => updateField("secondaryColor", e.target.value)}
                        className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => updateField("secondaryColor", e.target.value)}
                        className="input flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Preview</label>
                  <div 
                    className="p-6 rounded-lg text-white"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    <h3 className="text-xl font-bold mb-2">{formData.businessName || "Your Business"}</h3>
                    <p className="text-sm opacity-80 mb-4">{formData.tagline || "Your tagline here"}</p>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Email Setup */}
            {step === 4 && (
              <div className="card p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="heading-3 text-slate-900 mb-2">Email Notifications</h2>
                  <p className="text-body text-sm">Configure email alerts for new leads.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Resend Integration</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    We use Resend for reliable email delivery. To enable this:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1 mb-4">
                    <li>Create an account at <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline">resend.com</a></li>
                    <li>Create an API Key</li>
                    <li>Run this command in your terminal:</li>
                  </ol>
                  <code className="block bg-blue-100 p-2 rounded text-xs font-mono text-blue-900">
                    wrangler secret put RESEND_API_KEY
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableEmail"
                    name="enableEmail"
                    checked={Boolean(formData.enableEmail)}
                    onChange={(e) => setFormData(prev => ({ ...prev, enableEmail: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableEmail" className="text-sm font-medium text-slate-700">
                    I have configured the Resend API key
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Product Schema (Retail Only) */}
            {step === 5 && (
              <div className="card p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="heading-3 text-slate-900 mb-2">Product Attributes</h2>
                  <p className="text-body text-sm">Define custom fields for your products (e.g., Size, Color).</p>
                </div>

                <div className="space-y-4">
                  {formData.productSchema.map((field, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Field Name</label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => {
                            const newSchema = [...formData.productSchema];
                            newSchema[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, productSchema: newSchema }));
                          }}
                          className="input py-2"
                          placeholder="e.g. Size"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const newSchema = [...formData.productSchema];
                            newSchema[index].type = e.target.value as any;
                            setFormData(prev => ({ ...prev, productSchema: newSchema }));
                          }}
                          className="input py-2"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="boolean">Yes/No</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newSchema = formData.productSchema.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, productSchema: newSchema }));
                        }}
                        className="mt-6 text-red-500 hover:text-red-700 p-2"
                        aria-label="Remove field"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        productSchema: [...prev.productSchema, { name: "", type: "text", required: false }]
                      }));
                    }}
                    className="btn-outline w-full border-dashed"
                  >
                    + Add Custom Field
                  </button>
                </div>
              </div>
            )}
            
            {/* Error */}
            {actionData?.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {actionData.error}
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-outline"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}
              
              {/* Check if we are at the last step (4 for others, 5 for retail) */}
              {step < (formData.industry === "retail" ? 5 : 4) ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed}
                  className="btn-primary disabled:opacity-50"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? "Launching..." : "Launch Site 🚀"}
                </button>
              )}
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
