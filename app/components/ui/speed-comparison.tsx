import * as React from "react";
import { cn } from "~/lib/utils";
import { Progress } from "~/components/ui/progress";
import { Zap, Clock } from "lucide-react";

interface SpeedItem {
    label: string;
    progress: number;
    color: "fast" | "slow";
    icon?: React.ReactNode;
    time?: string;
}

interface SpeedComparisonProps {
    items: SpeedItem[];
    className?: string;
}

function SpeedBar({
    item,
    index
}: {
    item: SpeedItem;
    index: number;
}) {
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        // Stagger the animations
        const timer = setTimeout(() => {
            setWidth(item.progress);
        }, 300 + index * 400);

        return () => clearTimeout(timer);
    }, [item.progress, index]);

    const isFast = item.color === "fast";

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl",
                        isFast
                            ? "bg-gradient-to-br from-cyan-500 to-violet-500 text-white"
                            : "bg-slate-700 text-slate-400"
                    )}>
                        {item.icon || (isFast ? <Zap className="w-5 h-5" /> : <Clock className="w-5 h-5" />)}
                    </div>
                    <div>
                        <p className={cn(
                            "font-semibold",
                            isFast ? "text-white" : "text-slate-400"
                        )}>
                            {item.label}
                        </p>
                        {item.time && (
                            <p className={cn(
                                "text-sm",
                                isFast ? "text-cyan-400" : "text-slate-500"
                            )}>
                                {item.time}
                            </p>
                        )}
                    </div>
                </div>
                <span className={cn(
                    "text-2xl font-bold tabular-nums",
                    isFast ? "text-white" : "text-slate-500"
                )}>
                    {width}%
                </span>
            </div>

            {/* Progress bar using the Progress component */}
            <Progress
                value={width}
                variant={isFast ? "gradient" : "default"}
                size="lg"
                animated={isFast}
                glow={isFast}
                className={cn(!isFast && "[&>div]:bg-slate-800 [&>div>div]:bg-slate-600")}
            />
        </div>
    );
}

export function SpeedComparison({ items, className }: SpeedComparisonProps) {
    return (
        <div className={cn("space-y-8", className)}>
            {items.map((item, index) => (
                <SpeedBar key={item.label} item={item} index={index} />
            ))}
        </div>
    );
}

// Pre-configured comparison for the landing page
export function DeveloperSpeedComparison({ className }: { className?: string }) {
    const items: SpeedItem[] = [
        {
            label: "With This Template",
            progress: 85,
            color: "fast",
            time: "Deploy in minutes",
        },
        {
            label: "Traditional Setup",
            progress: 25,
            color: "slow",
            time: "Days of configuration",
        },
    ];

    return <SpeedComparison items={items} className={className} />;
}
