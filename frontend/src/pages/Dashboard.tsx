import React, { useState, useMemo, useEffect } from 'react';
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
import { EmergencyAlert } from '../components/dashboard/EmergencyAlert';

const Dashboard = () => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'history'>('dashboard');

    // Fetch real-time vitals from backend
    const { vitals, loading, error } = useVitals(2000); // Refresh every 2 seconds
    const { alertActive } = useAlert(3000); // Check alerts every 3 seconds

    // State for continuous graph data (real-time monitoring)
    const [hrHistory, setHrHistory] = useState<{ time: number, value: number }[]>([]);
    const [brHistory, setBrHistory] = useState<{ time: number, value: number }[]>([]);

    // Update history when new vitals arrive
    useEffect(() => {
        if (!vitals) return;

        const now = Date.now();
        const MAX_POINTS = 30; // Show last 30 data points

        // Update heart rate history
        setHrHistory(prev => {
            const newData = [...prev, { time: now, value: vitals.pulse_rate || 0 }];
            return newData.slice(-MAX_POINTS); // Keep only last MAX_POINTS
        });

        // Update breathing rate history
        setBrHistory(prev => {
            const newData = [...prev, { time: now, value: vitals.breathing_rate || 0 }];
            return newData.slice(-MAX_POINTS);
        });
    }, [vitals]);

    // Format data for chart (with relative time labels)
    const hrData = useMemo(() => {
        if (hrHistory.length === 0) return [];
        const firstTime = hrHistory[0].time;
        return hrHistory.map((point, i) => ({
            time: i.toString(), // Simple index for x-axis
            value: point.value,
            seconds: Math.floor((point.time - firstTime) / 1000) // For tooltip
        }));
    }, [hrHistory]);

    const respData = useMemo(() => {
        if (brHistory.length === 0) return [];
        const firstTime = brHistory[0].time;
        return brHistory.map((point, i) => ({
            time: i.toString(),
            value: point.value,
            seconds: Math.floor((point.time - firstTime) / 1000)
        }));
    }, [brHistory]);

    // Determine vital status based on values (adjusted for warning)
    const getHeartRateStatus = (hr: number): 'ok' | 'warning' | 'critical' => {
        if (hr < 50 || hr > 120) return 'critical'; // Severe abnormal
        if (hr < 60 || hr > 100) return 'warning';  // Mild abnormal (yellow)
        return 'ok';
    };

    const getBreathingRateStatus = (br: number): 'ok' | 'warning' | 'critical' => {
        if (br < 10 || br > 25) return 'critical'; // Severe abnormal
        if (br < 12 || br > 20) return 'warning';  // Mild abnormal
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
            {/* Emergency Alert Modal - Shows over everything */}
            <EmergencyAlert
                isActive={alertActive}
                vitalData={{
                    pulse_rate: vitals?.pulse_rate || 0,
                    breathing_rate: vitals?.breathing_rate || 0
                }}
            />

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
                                minValue={40}
                                maxValue={140}
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
                                minValue={8}
                                maxValue={30}
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
