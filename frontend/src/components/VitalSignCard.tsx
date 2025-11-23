import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface VitalSignCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  subtitle?: string;
  chartData?: Array<{ value: number }>;
}

export const VitalSignCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status = "normal",
  trend,
  subtitle,
  chartData = [],
}: VitalSignCardProps) => {
  const statusColors = {
    normal: { text: "text-green-400", border: "border-l-green-400" },
    warning: { text: "text-yellow-400", border: "border-l-yellow-400" },
    critical: { text: "text-red-400", border: "border-l-red-400" },
  };

  const chartColor = {
    normal: "#22c55e",
    warning: "#eab308",
    critical: "#ef4444",
  };

  return (
    <Card className={`border-l-4 ${statusColors[status].border} hover:shadow-lg transition-shadow bg-slate-900/50 border-slate-800`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </CardTitle>
          <Icon className={cn("h-3.5 w-3.5", statusColors[status].text)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-1">
          <div className={cn("text-3xl font-bold", statusColors[status].text)}>
            {value}
          </div>
          {unit && <span className="text-xs text-slate-400">{unit}</span>}
        </div>
        
        {chartData.length > 0 && (
          <div className="h-14 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor[status]}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", statusColors[status].text, "bg-slate-800")}>
            {status.toUpperCase()}
          </span>
          <span className="text-xs text-slate-500">Last 2s</span>
        </div>
      </CardContent>
    </Card>
  );
};
