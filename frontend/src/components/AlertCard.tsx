import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BedDouble, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  type: "fall" | "anxiety";
  isActive: boolean;
  level?: "low" | "medium" | "high";
}

export const AlertCard = ({ type, isActive, level = "medium" }: AlertCardProps) => {
  const config = {
    fall: {
      title: "Fall Detection",
      icon: BedDouble,
      activeText: "Patient has fallen",
      inactiveText: "No falls detected",
    },
    anxiety: {
      title: "Anxiety Level",
      icon: Brain,
      activeText: "Elevated anxiety detected",
      inactiveText: "Anxiety normal",
    },
  };

  const levelColors = {
    low: "bg-green-500/20 text-green-300 border border-green-500/40",
    medium: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
    high: "bg-red-500/20 text-red-300 border border-red-500/40",
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <Card
      className={cn(
        "transition-all bg-slate-900/50 border-slate-800",
        isActive && level === "high" && "border-l-4 border-l-red-600 shadow-lg shadow-red-600/10"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          {currentConfig.title}
          <Icon className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isActive ? (
            <>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
                <span className="text-xs font-semibold text-red-300">{currentConfig.activeText}</span>
              </div>
              {type === "anxiety" && (
                <Badge className={cn("font-semibold text-xs", levelColors[level])}>
                  {level.toUpperCase()} LEVEL
                </Badge>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-slate-400">
                {currentConfig.inactiveText}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
