import React, { useState } from 'react';
import { LiveMonitor } from '../components/dashboard/LiveMonitor';
import { Layout } from '../components/layout/Layout';
import { PatientInfo } from '../components/dashboard/PatientInfo';
import { VitalGraphCard } from '../components/dashboard/VitalGraphCard';
import { PatientHistory } from '../components/dashboard/PatientHistory';
import { Heart, Wind, Bell, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'history'>('dashboard');

    // Mock Data
    const hrData = Array.from({ length: 20 }, (_, i) => ({
        time: `10:${30 + i}`,
        value: 70 + Math.random() * 10 + (i > 15 ? 20 : 0)
    }));

    const respData = Array.from({ length: 20 }, (_, i) => ({
        time: `10:${30 + i}`,
        value: 16 + Math.random() * 4
    }));

    const handleAction = (action: string) => {
        if (action === "VIEW HISTORY") {
            setCurrentView('history');
            return;
        }
        toast.success(`ACTION: ${action}`, {
            description: "System command executed successfully.",
            duration: 2000,
        });
    };

    return (
        <Layout>
            {currentView === 'dashboard' ? (
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 h-[calc(100vh-60px)] overflow-hidden animate-fade-in">
                    {/* LEFT PANEL (40%) */}
                    <div className="flex flex-col gap-2 h-full overflow-hidden">
                        {/* Reserved Alert Space */}
                        <div className="flex-none h-8 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-[10px] font-mono text-tactical-textMuted uppercase tracking-widest opacity-50">
                            Reserved for Alerts
                        </div>

                        {/* Video Feed */}
                        <div className="flex-1 min-h-0">
                            <LiveMonitor />
                        </div>

                        {/* Patient Info */}
                        <div className="flex-none">
                            <PatientInfo />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 flex-none">
                            <button
                                onClick={() => handleAction("TEST ALERT")}
                                className="p-3 glass-panel hover:bg-tactical-amber/10 border-tactical-amber/30 hover:border-tactical-amber text-tactical-amber transition-all flex items-center justify-center gap-2 group"
                            >
                                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-mono font-bold uppercase tracking-wider text-xs">Test Alert</span>
                            </button>
                            <button
                                onClick={() => handleAction("VIEW HISTORY")}
                                className="p-3 glass-panel hover:bg-white/5 border-white/10 hover:border-white/30 text-white transition-all flex items-center justify-center gap-2 group"
                            >
                                <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-mono font-bold uppercase tracking-wider text-xs">View History</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL (60%) */}
                    <div className="flex flex-col gap-6 h-full overflow-hidden">
                        {/* Heart Rate */}
                        <div className="h-[calc(50%-12px)] min-h-0">
                            <VitalGraphCard
                                title="HEART RATE"
                                value="72"
                                unit="BPM"
                                status="ok"
                                icon={Heart}
                                color="#00d9ff"
                                data={hrData}
                            />
                        </div>

                        {/* Breathing Rate */}
                        <div className="h-[calc(50%-12px)] min-h-0">
                            <VitalGraphCard
                                title="BREATHING RATE"
                                value="16"
                                unit="RPM"
                                status="ok"
                                icon={Wind}
                                color="#00ff88"
                                data={respData}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col gap-4 animate-fade-in">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className="self-start flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-mono text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <div className="flex-1 min-h-0">
                        <PatientHistory />
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
