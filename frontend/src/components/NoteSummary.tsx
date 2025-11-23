// src/components/NoteSummary.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NoteSummaryProps {
  text: string;
  title?: string;
}

export const NoteSummary = ({ text, title = "Note Summary" }: NoteSummaryProps) => (
  <Card className="w-full h-[300px] max-w-[350px] aspect-square flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col p-2">
      <ScrollArea className="flex-1">
        <div className="text-sm text-muted-foreground whitespace-pre-line">{text}</div>
      </ScrollArea>
    </CardContent>
  </Card>
);