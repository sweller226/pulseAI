import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Activity, Phone } from 'lucide-react';

interface EmergencyAlertProps {
    isActive: boolean;
    vitalData?: {
        pulse_rate: number;
        breathing_rate: number;
    };
}

export const EmergencyAlert = ({ isActive, vitalData }: EmergencyAlertProps) => {
    const [hasPlayedSound, setHasPlayedSound] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (isActive && !hasPlayedSound) {
            // Play emergency sound
            if (audioRef.current) {
                audioRef.current.play().catch(err => console.warn('Audio play failed:', err));
            }
            setHasPlayedSound(true);
        } else if (!isActive) {
            setHasPlayedSound(false);
        }
    }, [isActive, hasPlayedSound]);

    if (!isActive) return null;

    return (
        <>
            {/* Emergency Sound Effect - Using browser's built-in audio */}
            <audio
                ref={audioRef}
                src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiP0fK+dycFJHfJ8NiPRgoUXrTr6qZVFApGn+DyvmshBjiP0fK+dycFJHfJ8NiPRgoUXrTr6qZUFApGn+Dxv2whBjiP0fK+dyYFJHfJ8NiPRgoUXrTr6qZVFApGn+Dxv2shBjiP0fK+dyYFJHfJ8NiPRgoUX7Tr6qZVFApGn+Dxv2shBjiP0fK+dyYFJHfJ8NiPRgoUX7Tr6qZVEwpGn+Dxv2shBjiP0fK+dyYFJHfJ8NiPRgoUX7Tr6qZVEwpGn+Dxv2shBjiP0fK+dyYFJHfJ8NiPRgoUX7Tr6qZVEwpGn+Dxv2shBjiP0fK+dyYFJHfJ8NmPRgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfJ8NmPRgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfJ8NmPRgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfJ8NmPRgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfJ8NmORgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfH8NmORgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfH8NmORgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfH8NmORgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYFJHfH8NmORgoUX7Pr6qVVEwpGn+Dxv2shBjiP0fK+dyYF"
                preload="auto"
            />

            {/* Full Screen Emergency Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
                {/* Backdrop with pulsing red glow */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md">
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}
                    />
                </div>

                {/* Emergency Alert Modal */}
                <div className="relative z-10 max-w-2xl w-full mx-4 animate-scale-in">
                    {/* Alert Container */}
                    <div className="glass-panel border-red-500/50 bg-red-500/10 p-8 relative overflow-hidden">
                        {/* Animated border pulse */}
                        <div
                            className="absolute inset-0 border-2 border-red-500 rounded-xl"
                            style={{
                                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Icon and Title */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative">
                                    <div
                                        className="absolute inset-0 bg-red-500/30 rounded-full blur-xl"
                                        style={{
                                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                        }}
                                    />
                                    <AlertTriangle className="w-20 h-20 text-red-500 animate-pulse-glow relative" />
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold text-center text-red-400 mb-2 uppercase tracking-wider">
                                Emergency Detected
                            </h1>
                            <p className="text-center text-red-300/80 text-lg mb-8">
                                Abnormal vital signs detected - Alert system activated
                            </p>

                            {/* Vital Signs Display */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {/* Heart Rate */}
                                <div className="glass-effect p-4 rounded-lg border border-red-500/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Activity className="w-5 h-5 text-red-400" />
                                        <span className="text-sm text-gray-300 uppercase tracking-wide">Heart Rate</span>
                                    </div>
                                    <div className="text-3xl font-bold text-red-400 tabular-nums">
                                        {vitalData?.pulse_rate || '--'} <span className="text-lg text-gray-400">BPM</span>
                                    </div>
                                </div>

                                {/* Breathing Rate */}
                                <div className="glass-effect p-4 rounded-lg border border-red-500/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Activity className="w-5 h-5 text-red-400" />
                                        <span className="text-sm text-gray-300 uppercase tracking-wide">Breathing</span>
                                    </div>
                                    <div className="text-3xl font-bold text-red-400 tabular-nums">
                                        {vitalData?.breathing_rate || '--'} <span className="text-lg text-gray-400">RPM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Messages */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 glass-effect rounded-lg border border-red-500/20">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-glow" />
                                    <span className="text-sm text-gray-300">AI Voice Assistant Initiated</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 glass-effect rounded-lg border border-red-500/20">
                                    <Phone className="w-4 h-4 text-red-400 animate-pulse" />
                                    <span className="text-sm text-gray-300">Emergency Services on Standby</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    Monitoring in Progress • Do Not Panic
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
