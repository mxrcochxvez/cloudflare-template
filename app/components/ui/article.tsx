import * as React from "react";
import { cn } from "~/lib/utils";

interface ArticleProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Whether to apply prose styling for readable content
   */
  prose?: boolean;
}

const Article = React.forwardRef<HTMLElement, ArticleProps>(
  ({ className, prose = true, children, ...props }, ref) => {
    return (
      <article
        ref={ref}
        className={cn(
          prose && [
            "prose prose-slate dark:prose-invert max-w-none",
            // Headings
            "prose-headings:font-semibold prose-headings:tracking-tight",
            "prose-h1:text-3xl prose-h1:md:text-4xl",
            "prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:border-b prose-h2:pb-2 prose-h2:border-border",
            "prose-h3:text-xl prose-h3:md:text-2xl",
            // Links
            "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
            // Code
            "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal",
            "prose-pre:bg-slate-900 prose-pre:text-slate-50",
            // Lists
            "prose-li:marker:text-muted-foreground",
          ],
          className
        )}
        {...props}
      >
        {children}
      </article>
    );
  }
);
Article.displayName = "Article";

export { Article };
