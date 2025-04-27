import { Card, CardContent } from "~/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
    title: string
    value: number | string
    icon: React.ComponentType<{ className?: string }>
    trend: number
    trendColor?: string
}

export function MetricCard({
    title,
    value,
    icon: Icon,
    trend, 
}: MetricCardProps) {
    const TrendIcon = trend > 0 ? TrendingUp : TrendingDown
    const trendClass = trend > 0 ? "text-green-500" : "text-red-500"

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <TrendIcon className={`h-4 w-4 ${trendClass}`} />
                    <span className={`text-sm ${trendClass}`}>
                        {Math.abs(trend)}% from last month
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
