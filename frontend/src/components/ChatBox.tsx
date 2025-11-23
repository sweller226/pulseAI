import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface LogMessage {
  id: string;
  content: string;
  timestamp: Date;
  severity?: "info" | "warning" | "critical";
}

interface ChatBoxProps {
  events?: LogMessage[];
  onViewAll?: () => void;
}

export const ChatBox = ({ events = [], onViewAll }: ChatBoxProps) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-critical/10 text-critical border-l-4 border-critical";
      case "warning":
        return "bg-warning/10 text-warning border-l-4 border-warning";
      default:
        return "bg-muted text-muted-foreground border-l-4 border-muted-foreground";
    }
  };

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Event Log
        </CardTitle>
        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="gap-1"
          >
            <span>View All</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-2 pb-3">
            {events.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No events logged</div>
            ) : (
              events.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className={`rounded-md px-3 py-2 text-sm ${getSeverityColor(event.severity)}`}
                >
                  <p>{event.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
