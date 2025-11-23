import React, { useState, useMemo } from 'react';
import { LiveMonitor } from '../components/dashboard/LiveMonitor';
import { Layout } from '../components/layout/Layout';
import { PatientInfo } from '../components/dashboard/PatientInfo';
import { VitalGraphCard } from '../components/dashboard/VitalGraphCard';
import { MoodCard } from '../components/dashboard/MoodCard';
import { PatientHistory } from '../components/dashboard/PatientHistory';
import { Heart, Wind, FileText, ArrowLeft, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { useVitals } from '../hooks/useVitals';
import { useAlert } from '../hooks/useAlert';

const Dashboard = () => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'history'>('dashboard');

    // Fetch real-time vitals from backend
    const { vitals, loading, error } = useVitals(2000); // Refresh every 2 seconds
    const { alertActive } = useAlert(3000); // Check alerts every 3 seconds

    // Generate historical data from current vitals (simulate trend)
    const hrData = useMemo(() => {
        if (!vitals) return [];
        const baseHR = vitals.pulse_rate || 72;
        return Array.from({ length: 20 }, (_, i) => ({
            time: `${new Date().getHours()}:${String(new Date().getMinutes() - (19 - i)).padStart(2, '0')}`,
            value: baseHR + (Math.random() * 6 - 3) // ±3 variation
        }));
    }, [vitals?.pulse_rate]);

    const respData = useMemo(() => {
        if (!vitals) return [];
        const baseBR = vitals.breathing_rate || 16;
        return Array.from({ length: 20 }, (_, i) => ({
            time: `${new Date().getHours()}:${String(new Date().getMinutes() - (19 - i)).padStart(2, '0')}`,
            value: baseBR + (Math.random() * 2 - 1) // ±1 variation
        }));
    }, [vitals?.breathing_rate]);

    // Determine vital status based on values
    const getHeartRateStatus = (hr: number): 'ok' | 'warning' | 'critical' => {
        if (hr < 60 || hr > 100) return 'critical';
        if (hr < 65 || hr > 95) return 'warning';
        return 'ok';
    };

    const getBreathingRateStatus = (br: number): 'ok' | 'warning' | 'critical' => {
        if (br < 12 || br > 20) return 'critical';
        if (br < 14 || br > 18) return 'warning';
        return 'ok';
    };

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
                <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4 h-[calc(100vh-60px)] overflow-hidden animate-fade-in px-6">
                    {/* LEFT PANEL (65%) */}
                    <div className="flex flex-col gap-3 h-full overflow-hidden">
                        {/* Connection Status Banner */}
                        {error && (
                            <div className="flex-none glass-panel p-3 border-red-500/30 bg-red-500/10 animate-slide-up">
                                <div className="flex items-center gap-2 text-red-400">
                                    <WifiOff className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Backend Disconnected</span>
                                    <span className="text-xs text-gray-400">- {error}</span>
                                </div>
                            </div>
                        )}

                        {/* Alert Banner */}
                        {alertActive && (
                            <div className="flex-none glass-panel p-3 border-red-500/50 bg-red-500/20 animate-pulse-glow">
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertCircle className="w-5 h-5 animate-pulse" />
                                    <span className="text-sm font-bold uppercase">ALERT ACTIVE</span>
                                </div>
                            </div>
                        )}

                        {/* Video Feed */}
                        <div className="flex-1 min-h-0">
                            <LiveMonitor />
                        </div>

                        {/* Patient Info */}
                        <div className="flex-none">
                            <PatientInfo />
                        </div>

                        {/* Quick Actions */}
                        <div className="flex-none">
                            <button
                                onClick={() => handleAction("VIEW HISTORY")}
                                className="w-full p-3 glass-panel hover:bg-white/10 text-white transition-smooth flex items-center justify-center gap-2 group hover-lift"
                            >
                                <FileText className="w-4 h-4 group-hover:scale-110 transition-smooth" />
                                <span className="font-semibold uppercase tracking-wider text-xs">View History</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL (35%) */}
                    <div className="flex flex-col gap-6 h-full overflow-hidden">
                        {/* Connection Indicator */}
                        <div className="flex items-center justify-end gap-2 text-xs">
                            {loading ? (
                                <span className="text-gray-400 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    Connecting...
                                </span>
                            ) : error ? (
                                <span className="text-red-400 flex items-center gap-1">
                                    <WifiOff className="w-3 h-3" />
                                    Offline
                                </span>
                            ) : (
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <Wifi className="w-3 h-3" />
                                    Live
                                </span>
                            )}
                        </div>

                        {/* Heart Rate */}
                        <div className="h-[calc(33%-12px)] min-h-0 max-h-[30vh]">
                            <VitalGraphCard
                                title="HEART RATE"
                                value={vitals?.pulse_rate?.toString() || '--'}
                                unit="BPM"
                                status={vitals ? getHeartRateStatus(vitals.pulse_rate) : 'ok'}
                                icon={Heart}
                                color="#00d9ff"
                                data={hrData}
                            />
                        </div>

                        {/* Breathing Rate */}
                        <div className="h-[calc(33%-12px)] min-h-0 max-h-[30vh]">
                            <VitalGraphCard
                                title="BREATHING RATE"
                                value={vitals?.breathing_rate?.toString() || '--'}
                                unit="RPM"
                                status={vitals ? getBreathingRateStatus(vitals.breathing_rate) : 'ok'}
                                icon={Wind}
                                color="#00ff88"
                                data={respData}
                            />
                        </div>

                        {/* Mood */}
                        <div className="h-[calc(33%-12px)] min-h-0 max-h-[30vh]">
                            <MoodCard
                                mood={vitals?.emotion_summary}
                                confidence={vitals?.emotion?.confidence} // Assuming confidence is available in details or root
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col gap-4 animate-fade-in px-6">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className="self-start flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/10 text-white font-semibold text-sm transition-smooth hover-lift"
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
