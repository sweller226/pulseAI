import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface LogMessage {
  id: string;
  content: string;
  timestamp: Date;
  severity?: "info" | "warning" | "critical";
}

interface FullEventLogProps {
  events: LogMessage[];
}

export const FullEventLog = ({ events }: FullEventLogProps) => {
  const getSeverityStyles = (severity?: string) => {
    switch (severity) {
      case "critical":
        return { bg: "bg-red-500/10", border: "border-l-red-500", text: "text-red-300", badge: "bg-red-600/30 text-red-200" };
      case "warning":
        return { bg: "bg-yellow-500/10", border: "border-l-yellow-500", text: "text-yellow-300", badge: "bg-yellow-600/30 text-yellow-200" };
      default:
        return { bg: "bg-slate-500/5", border: "border-l-slate-500", text: "text-slate-400", badge: "bg-slate-600/30 text-slate-300" };
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "CRITICAL";
      case "warning":
        return "WARNING";
      default:
        return "INFO";
    }
  };

  return (
    <ScrollArea className="w-full h-full">
      <div className="space-y-1 p-2">
        {events.length === 0 ? (
          <div className="text-center text-slate-500 py-4 text-xs">
            No events logged yet
          </div>
        ) : (
          events.map((event) => {
            const styles = getSeverityStyles(event.severity);
            return (
              <div
                key={event.id}
                className={`rounded-md px-2 py-1.5 text-xs border-l-2 ${styles.border} ${styles.bg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-medium line-clamp-2 ${styles.text}`}>{event.content}</p>
                  <Badge className={`text-xs font-bold whitespace-nowrap ${styles.badge}`} variant="secondary">
                    {getSeverityBadge(event.severity)}
                  </Badge>
                </div>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  {event.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};
