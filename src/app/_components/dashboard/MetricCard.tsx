import { Card, CardContent } from "~/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    trend: number;
    color?: "blue" | "green" | "amber" | "purple" | "rose";
}

export function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue"
}: MetricCardProps) { 
    const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;
    const trendClass = trend >= 0 ? "text-green-500" : "text-red-500";
 
    const colorClasses = {
        blue: "text-blue-600 bg-blue-100",
        green: "text-green-600 bg-green-100",
        amber: "text-amber-600 bg-amber-100",
        purple: "text-purple-600 bg-purple-100",
        rose: "text-rose-600 bg-rose-100"
    };
 
    const trendPercentage = typeof trend === 'number' ? Math.abs(trend) : 0;

    return (
        <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                    <div className={`rounded-full p-3 ${colorClasses[color]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <TrendIcon className={`h-4 w-4 ${trendClass}`} />
                    <span className={`text-sm ${trendClass}`}>
                        {trendPercentage}% from last month
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}