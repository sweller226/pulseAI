import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HealthStatusCardProps {
  healthLevel: number; // 0-100
}

export const HealthStatusCard = ({ healthLevel }: HealthStatusCardProps) => {
  const getHealthStatus = (level: number) => {
    if (level >= 80) return { text: "Excellent", color: "text-success" };
    if (level >= 60) return { text: "Good", color: "text-success" };
    if (level >= 40) return { text: "Fair", color: "text-warning" };
    if (level >= 20) return { text: "Poor", color: "text-critical" };
    return { text: "Critical", color: "text-critical" };
  };

  const status = getHealthStatus(healthLevel);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Overall Health Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Health Level</span>
            <span className={cn("text-2xl font-bold", status.color)}>
              {status.text}
            </span>
          </div>
          <Progress value={healthLevel} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Critical</span>
            <span>Fair</span>
            <span>Excellent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
