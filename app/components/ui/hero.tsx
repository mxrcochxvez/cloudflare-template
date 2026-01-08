import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { Container } from "./container";
import { Button } from "./button";

const heroVariants = cva("relative overflow-hidden", {
  variants: {
    size: {
      sm: "py-16 md:py-20",
      md: "py-20 md:py-28",
      lg: "py-24 md:py-36",
      full: "min-h-screen flex items-center",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    size: "lg",
    align: "center",
  },
});

export interface HeroProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof heroVariants> {
  /**
   * Main headline text
   */
  title: string;
  /**
   * Supporting subtitle or description
   */
  subtitle?: string;
  /**
   * Primary CTA button text
   */
  primaryCta?: string;
  /**
   * Primary CTA click handler or href
   */
  onPrimaryClick?: () => void;
  /**
   * Secondary CTA button text
   */
  secondaryCta?: string;
  /**
   * Secondary CTA click handler
   */
  onSecondaryClick?: () => void;
  /**
   * Background image URL
   */
  backgroundImage?: string;
  /**
   * Whether to add overlay on background image
   */
  overlay?: boolean;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      size,
      align,
      title,
      subtitle,
      primaryCta,
      onPrimaryClick,
      secondaryCta,
      onSecondaryClick,
      backgroundImage,
      overlay = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(heroVariants({ size, align }), className)}
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
        {...props}
      >
        {backgroundImage && overlay && (
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        )}
        <Container className="relative z-10">
          <div
            className={cn(
              "mx-auto",
              align === "center" && "max-w-3xl",
              align === "left" && "max-w-2xl"
            )}
          >
            <h1
              className={cn(
                "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl",
                backgroundImage ? "text-white" : "text-foreground"
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  "mt-6 text-lg leading-8 md:text-xl",
                  backgroundImage ? "text-gray-200" : "text-muted-foreground"
                )}
              >
                {subtitle}
              </p>
            )}
            {(primaryCta || secondaryCta) && (
              <div
                className={cn(
                  "mt-10 flex gap-4",
                  align === "center" && "justify-center",
                  align === "right" && "justify-end"
                )}
              >
                {primaryCta && (
                  <Button size="lg" onClick={onPrimaryClick}>
                    {primaryCta}
                  </Button>
                )}
                {secondaryCta && (
                  <Button variant="outline" size="lg" onClick={onSecondaryClick}>
                    {secondaryCta}
                  </Button>
                )}
              </div>
            )}
            {children}
          </div>
        </Container>
      </section>
    );
  }
);
Hero.displayName = "Hero";

export { Hero, heroVariants };
