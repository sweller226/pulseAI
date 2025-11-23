import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { VitalDataPoint } from "@/components/VitalDataPoint";

interface VitalSignsChartProps {
  data: VitalDataPoint[];
}

export const VitalSignsChart = ({ data }: VitalSignsChartProps) => {
  const [timeRange, setTimeRange] = useState([0, 0]);

  // Update max range when data changes
  useEffect(() => {
    setTimeRange([0, data.length]);
  }, [data.length]);

  const maxDataPoints = data.length;
  const startIndex = Math.max(0, data.length - timeRange[1]);
  const endIndex = Math.max(1, data.length - timeRange[0]);
  const filteredData = data.slice(startIndex, endIndex);
  const displayRange = timeRange[1] - timeRange[0];

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Vital Signs History
        </CardTitle>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-300 w-32">
              Time Range <span className="text-cyan-400">({displayRange})</span>
            </label>
            <Slider
              value={timeRange}
              onValueChange={setTimeRange}
              min={0}
              max={maxDataPoints || 1}
              step={1}
              minStepsBetweenThumbs={5}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono px-0">
            <span>From: {Math.max(1, data.length - timeRange[1])}</span>
            <span>To: {Math.max(1, data.length - timeRange[0])}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
            <XAxis
              dataKey="time"
              stroke="rgba(148,163,184,0.6)"
              tick={{ fontSize: 12, fill: "rgba(148,163,184,0.8)" }}
            />
            <YAxis stroke="rgba(148,163,184,0.6)" tick={{ fontSize: 12, fill: "rgba(148,163,184,0.8)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(71,85,105,0.5)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#cbd5e1" }}
              itemStyle={{ color: "#cbd5e1" }}
            />
            <Legend 
              wrapperStyle={{ color: "rgba(148,163,184,0.8)" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#ef4444"
              dot={false}
              strokeWidth={2.5}
              name="Heart Rate (BPM)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="breathingRate"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2.5}
              name="Breathing Rate (BrPM)"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
