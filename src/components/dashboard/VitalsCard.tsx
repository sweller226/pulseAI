import React from 'react';
import { LucideIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface VitalsCardProps {
    title: string;
    value: string;
    unit: string;
    icon: LucideIcon;
    color: string; // hex color
    trend?: string;
    status?: 'normal' | 'warning' | 'critical';
    data?: { value: number }[];
}

export const VitalsCard = ({
    title,
    value,
    unit,
    icon: Icon,
    color,
    trend,
    status = 'normal',
    data = [{ value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 48 }, { value: 60 }, { value: 55 }]
}: VitalsCardProps) => {

    const getStatusColor = () => {
        switch (status) {
            case 'critical': return '#ff3b3b'; // tactical-red
            case 'warning': return '#f59e0b'; // tactical-amber
            default: return color;
        }
    };

    const statusColor = getStatusColor();

    return (
        <div className={`relative overflow-hidden rounded-xl border bg-tactical-panel backdrop-blur-md transition-all duration-300 group hover:scale-[1.02] ${status === 'critical'
                ? 'border-tactical-red shadow-[0_0_20px_rgba(255,59,59,0.3)]'
                : 'border-tactical-border hover:border-tactical-cyan/50'
            }`}>
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>

            <div className="p-3 relative z-10 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: statusColor }} />
                        <span className="text-[10px] font-mono font-bold text-tactical-textMuted uppercase tracking-wider">{title}</span>
                    </div>
                    {status === 'critical' && (
                        <div className="w-2 h-2 rounded-full bg-tactical-red animate-pulse shadow-[0_0_5px_#ff3b3b]"></div>
                    )}
                </div>

                {/* Value & Sparkline Row */}
                <div className="flex items-end justify-between gap-2">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 10px ${statusColor}40` }}>
                                {value}
                            </span>
                            <span className="text-[10px] font-mono text-tactical-textMuted">{unit}</span>
                        </div>
                        {trend && (
                            <div className="text-[10px] font-mono text-tactical-textSec mt-0.5">
                                {trend}
                            </div>
                        )}
                    </div>

                    {/* Sparkline */}
                    <div className="h-8 w-16 opacity-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={statusColor}
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
