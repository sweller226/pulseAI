import React, { useEffect, useRef, useState } from 'react';
import { Video, Maximize2, Camera, AlertCircle } from 'lucide-react';

export const LiveMonitor = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                // Request camera access
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        facingMode: 'user'
                    },
                    audio: false
                });

                // Set video stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Camera access error:', error);
                setCameraError('Unable to access camera. Please grant camera permissions.');
                setIsLoading(false);
            }
        };

        startCamera();

        // Cleanup function
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="h-full flex flex-col animate-fade-in">
            {/* Main Video Feed - Live Camera with Apple-like effects */}
            <div className="flex-1 max-h-[65vh] relative bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl transition-smooth hover:shadow-cyan-500/10 hover:border-white/30 group">

                {/* Status Bar Top - Minimal and Clean with smooth animations */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between animate-slide-up">
                    <div className="flex items-center gap-2 px-3 py-1.5 glass-effect rounded-lg transition-smooth hover:bg-white/10">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-glow shadow-lg shadow-red-500/50"></div>
                        <span className="text-xs font-semibold text-white">LIVE</span>
                        <span className="text-xs text-gray-300 border-l border-white/20 pl-2 ml-1 tabular-nums">
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 glass-effect rounded-lg transition-smooth hover:bg-cyan-500/10">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs text-cyan-400 font-semibold">WEBCAM</span>
                    </div>
                </div>

                {/* Live Video Feed */}
                <div className="w-full h-full bg-neutral-900 relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
                            <div className="text-center">
                                <Camera className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-pulse" />
                                <p className="text-sm text-gray-400">Initializing camera...</p>
                            </div>
                        </div>
                    )}

                    {cameraError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
                            <div className="text-center max-w-md px-6">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                <p className="text-sm text-red-400 mb-2">Camera Access Error</p>
                                <p className="text-xs text-gray-400">{cameraError}</p>
                            </div>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transition-smooth-slow group-hover:scale-105"
                    />

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none"></div>
                </div>

                {/* Controls - Subtle and Professional with hover effect */}
                <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-smooth">
                    <button className="p-2.5 glass-effect hover:bg-white/15 text-white hover:text-cyan-400 rounded-lg transition-smooth hover-lift">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
