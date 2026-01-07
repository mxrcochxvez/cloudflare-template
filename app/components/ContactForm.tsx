import { Form, useActionData, useNavigation } from "@remix-run/react";

interface ContactFormData {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
}

export function ContactForm() {
  const actionData = useActionData<ContactFormData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (actionData?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <svg
          className="w-12 h-12 text-green-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="heading-3 text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-600">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <Form method="post" className="space-y-6">
      {actionData?.error && (
        <div 
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
          role="alert"
        >
          {actionData.error}
        </div>
      )}

      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
          Your Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          className={`input ${actionData?.fieldErrors?.name ? "input-error" : ""}`}
          placeholder="John Smith"
          aria-describedby={actionData?.fieldErrors?.name ? "name-error" : undefined}
        />
        {actionData?.fieldErrors?.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {actionData.fieldErrors.name}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          Email Address <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className={`input ${actionData?.fieldErrors?.email ? "input-error" : ""}`}
          placeholder="john@example.com"
          aria-describedby={actionData?.fieldErrors?.email ? "email-error" : undefined}
        />
        {actionData?.fieldErrors?.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {actionData.fieldErrors.email}
          </p>
        )}
      </div>

      {/* Phone field (optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
          Phone Number <span className="text-slate-400">(Optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          autoComplete="tel"
          className="input"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
          Your Message <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`input resize-none ${actionData?.fieldErrors?.message ? "input-error" : ""}`}
          placeholder="Tell us about your project or question..."
          aria-describedby={actionData?.fieldErrors?.message ? "message-error" : undefined}
        />
        {actionData?.fieldErrors?.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {actionData.fieldErrors.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>

      <p className="text-small text-center">
        We respect your privacy. Your information will never be shared.
      </p>
    </Form>
  );
}
