import type { MenuItem } from "~/lib/db.server";

interface ServiceCardProps {
  service: MenuItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const formattedPrice = service.price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(service.price)
    : null;

  return (
    <article className="card group bg-white/80 backdrop-blur-sm">
      {/* Image */}
      {service.imageUrl ? (
        <div className="aspect-video overflow-hidden bg-amber-50">
          <img
            src={service.imageUrl}
            alt={`${service.title} - ${service.description || "Service offering"}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center relative overflow-hidden">
          {/* Honeycomb pattern */}
          <div className="absolute inset-0 bg-honeycomb opacity-50" aria-hidden="true" />
          {/* Hexagon icon */}
          <svg
            className="w-16 h-16 text-primary-400 relative z-10"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
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
            <span className="text-lg font-bold text-primary-600">
              {formattedPrice}
            </span>
            <button
              type="button"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
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
