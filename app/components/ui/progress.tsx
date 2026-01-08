import * as React from "react";
import { cn } from "~/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: "default" | "gradient" | "success" | "warning" | "danger";
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    animated?: boolean;
    glow?: boolean;
}

const variantStyles = {
    default: "bg-primary",
    gradient: "bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
};

const glowStyles = {
    default: "shadow-[0_0_10px_rgba(124,58,237,0.5)]",
    gradient: "shadow-[0_0_10px_rgba(139,92,246,0.5)]",
    success: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    warning: "shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    danger: "shadow-[0_0_10px_rgba(239,68,68,0.5)]",
};

const sizeStyles = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    (
        {
            className,
            value,
            max = 100,
            variant = "default",
            size = "md",
            showValue = false,
            animated = false,
            glow = false,
            ...props
        },
        ref
    ) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));

        return (
            <div className={cn("w-full", className)} ref={ref} {...props}>
                {showValue && (
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(percentage)}%</span>
                    </div>
                )}
                <div
                    className={cn(
                        "w-full overflow-hidden rounded-full bg-muted",
                        sizeStyles[size]
                    )}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                >
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out",
                            variantStyles[variant],
                            glow && glowStyles[variant],
                            animated && "relative overflow-hidden"
                        )}
                        style={{ width: `${percentage}%` }}
                    >
                        {animated && (
                            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,transparent_0%,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%,transparent_100%)] animate-shimmer bg-[length:200%_100%]" />
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

Progress.displayName = "Progress";

export { Progress, type ProgressProps };
