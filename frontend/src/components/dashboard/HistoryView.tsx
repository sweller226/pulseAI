import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '10:00', hr: 72, resp: 16 },
    { time: '10:05', hr: 75, resp: 17 },
    { time: '10:10', hr: 71, resp: 15 },
    { time: '10:15', hr: 73, resp: 16 },
    { time: '10:20', hr: 78, resp: 18 },
    { time: '10:25', hr: 74, resp: 16 },
    { time: '10:30', hr: 72, resp: 16 },
    { time: '10:35', hr: 70, resp: 15 },
    { time: '10:40', hr: 72, resp: 16 },
    { time: '10:45', hr: 75, resp: 17 },
    { time: '10:50', hr: 73, resp: 16 },
    { time: '10:55', hr: 71, resp: 15 },
];

export const HistoryView = () => {
    return (
        <div className="bg-tactical-bgSec border border-tactical-border rounded-sm p-4 h-[300px] relative overflow-hidden group hover:border-tactical-cyan/50 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-xs font-mono font-bold text-tactical-text uppercase tracking-widest">Real-time Vitals Trend</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-tactical-cyan animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-tactical-cyan"><div className="w-2 h-0.5 bg-tactical-cyan"></div> HR (BPM)</span>
                    <span className="flex items-center gap-1 text-tactical-emerald"><div className="w-2 h-0.5 bg-tactical-emerald"></div> RESP (RPM)</span>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-[calc(100%-2rem)]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#606060"
                            tick={{ fill: '#606060', fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#606060"
                            tick={{ fill: '#606060', fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#00d9ff40', borderRadius: '2px', fontFamily: 'monospace' }}
                            itemStyle={{ fontSize: '12px' }}
                            labelStyle={{ color: '#b0b0b0', fontSize: '10px', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="hr"
                            stroke="#00d9ff"
                            fillOpacity={1}
                            fill="url(#colorHr)"
                            strokeWidth={2}
                            animationDuration={2000}
                        />
                        <Area
                            type="monotone"
                            dataKey="resp"
                            stroke="#00ff88"
                            fillOpacity={1}
                            fill="url(#colorResp)"
                            strokeWidth={2}
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
