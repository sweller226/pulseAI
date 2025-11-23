import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LogMessage {
  id: string;
  content: string;
  timestamp: Date;
  severity?: "info" | "warning" | "critical";
}

const EventLog = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<LogMessage[]>([]);

  // Retrieve events from session storage or localStorage
  useEffect(() => {
    const storedEvents = sessionStorage.getItem("eventLogs");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Listen for storage changes to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const storedEvents = sessionStorage.getItem("eventLogs");
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents).map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
        setEvents(parsedEvents);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Also poll for updates every 500ms
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Event Log</h1>
        </div>

        {/* Events Container */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="p-6 space-y-3">
              {events.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  No events logged yet
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className={`rounded-md px-4 py-3 text-sm ${getSeverityColor(event.severity)}`}
                  >
                    <p className="font-medium">{event.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {event.timestamp.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLog;
