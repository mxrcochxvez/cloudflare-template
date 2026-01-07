import type { MenuItem } from "~/lib/db.server";
import { useBranding } from "~/context/BrandingContext";

interface ServiceCardProps {
  service: MenuItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const branding = useBranding();
  
  const formattedPrice = service.price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(service.price)
    : null;

  return (
    <article className="card group">
      {/* Image */}
      {service.imageUrl ? (
        <div className="aspect-video overflow-hidden bg-slate-100">
          <img
            src={service.imageUrl}
            alt={`${service.title} - ${service.description || "Service offering"}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div 
          className="aspect-video flex items-center justify-center"
          style={{ backgroundColor: `${branding.primaryColor}15` }}
        >
          <svg
            className="w-12 h-12"
            style={{ color: `${branding.primaryColor}60` }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category badge */}
        {service.category && (
          <span className="badge-primary text-xs mb-3">
            {service.category}
          </span>
        )}

        {/* Title */}
        <h3 className="heading-3 text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
          {service.title}
        </h3>

        {/* Description */}
        {service.description && (
          <p className="text-body text-sm line-clamp-3 mb-4">
            {service.description}
          </p>
        )}

        {/* Price */}
        {formattedPrice && (
          <div className="flex items-center justify-between">
            <span 
              className="text-lg font-bold"
              style={{ color: branding.primaryColor }}
            >
              {formattedPrice}
            </span>
            <button
              type="button"
              className="text-sm font-medium transition-colors"
              style={{ color: branding.primaryColor }}
              aria-label={`Learn more about ${service.title}`}
            >
              Learn more →
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
