import * as React from "react";
import { cn } from "~/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Section background variant
   */
  variant?: "default" | "muted" | "primary" | "dark";
  /**
   * Vertical padding size
   */
  size?: "sm" | "md" | "lg" | "xl";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", size = "lg", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-background",
      muted: "bg-muted",
      primary: "bg-primary text-primary-foreground",
      dark: "bg-slate-900 text-white",
    };

    const sizeClasses = {
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
      xl: "py-24 md:py-32",
    };

    return (
      <section
        ref={ref}
        className={cn(variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };
