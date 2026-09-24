import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Compass, Zap } from 'lucide-react';
import { MOCK_DRIVERS } from '../constants/mockData';

interface MapViewProps {
    showRoute?: boolean;
    showDriver?: boolean;
    isSearching?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
    showRoute = true,
    showDriver = false,
    isSearching = false,
}) => {
    // Animated driver car coordinates
    const [driverPos, setDriverPos] = useState({ x: 38, y: 55 });

    useEffect(() => {
        if (!showDriver) return;
        const interval = setInterval(() => {
            setDriverPos((prev) => {
                const nextX = prev.x + (62 - prev.x) * 0.08;
                const nextY = prev.y + (28 - prev.y) * 0.08;
                return { x: nextX, y: nextY };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [showDriver]);

    return (
        <div className="relative w-full h-full min-h-[320px] cyber-bg-dark overflow-hidden select-none border-b border-cyan-500/10">

            {/* Map Cyber Grid Vector Lines Background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="gridPattern" width="36" height="36" patternUnits="userSpaceOnUse">
                        <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="2 2" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern)" />
            </svg>

            {/* Futuristic Vector Road Overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-30 stroke-cyan-500/50" strokeWidth="16" fill="none">
                <path d="M -50 140 Q 150 180 450 100" />
                <path d="M 120 -50 L 140 450" />
                <path d="M -20 280 C 180 250 220 380 480 320" />
            </svg>

            {/* Glowing Main Neon Gradient Trajectory Route */}
            {showRoute && (
                <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" fill="none">
                    <defs>
                        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f0ff" />
                            <stop offset="50%" stopColor="#073da8" />
                            <stop offset="100%" stopColor="#7928CA" />
                        </linearGradient>
                        <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Neon Glow Outer Layer */}
                    <path
                        d="M 100 240 Q 180 120 280 90"
                        stroke="#00f0ff"
                        strokeWidth="14"
                        strokeLinecap="round"
                        opacity="0.4"
                        filter="url(#neonGlow)"
                    />

                    {/* Animated Route Flow Dashes */}
                    <path
                        d="M 100 240 Q 180 120 280 90"
                        stroke="url(#neonGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                        className="animate-route-dash"
                    />
                </svg>
            )}

            {/* Pickup Location Marker (Neon Emerald Pulse) */}
            <div className="absolute top-[230px] left-[85px] z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                <div className="relative flex items-center justify-center">
                    <span className="absolute w-12 h-12 rounded-full bg-emerald-400/30 animate-ping" />
                    <div className="w-5 h-5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/50 shadow-[0_0_20px_#10b981]" />
                </div>
                <div className="mt-1.5 px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/50 text-[10px] font-black text-emerald-300 shadow-2xl flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Pickup Point
                </div>
            </div>

            {/* Destination Location Marker (Cyber Cyan Pin) */}
            <div className="absolute top-[80px] left-[280px] z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                <div className="relative flex items-center justify-center">
                    <span className="absolute w-12 h-12 rounded-full bg-cyan-400/30 animate-ping" />
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#073da8] to-cyan-400 ring-4 ring-cyan-400/60 text-white flex items-center justify-center shadow-[0_0_25px_#00f0ff]">
                        <MapPin className="w-4 h-4 fill-current" />
                    </div>
                </div>
                <div className="mt-1.5 px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 text-[10px] font-black text-cyan-300 shadow-2xl flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    Downtown Dropoff
                </div>
            </div>

            {/* Ambient Driver Vehicles */}
            {MOCK_DRIVERS.map((d, i) => (
                <div
                    key={d.id}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{
                        top: `${30 + i * 22}%`,
                        left: `${20 + i * 26}%`,
                    }}
                >
                    <div className="relative p-2 rounded-2xl bg-slate-900/90 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-float">
                        <span className="text-base">🏎️</span>
                    </div>
                </div>
            ))}

            {/* Active Moving Driver Car */}
            {showDriver && (
                <div
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                    style={{
                        top: `${driverPos.y}%`,
                        left: `${driverPos.x}%`,
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        <span className="absolute w-16 h-16 rounded-full bg-cyan-400/30 animate-radar-pulse" />
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#073da8] to-cyan-500 ring-4 ring-cyan-300/50 text-white text-xl shadow-[0_0_30px_#00f0ff]">
                            🚘
                        </div>
                    </div>
                </div>
            )}

            {/* Sonar Radar Scan Grid */}
            {isSearching && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="relative w-80 h-80 rounded-full border border-cyan-500/30 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-radar-pulse" />
                        <div className="absolute w-full h-full rounded-full border-t-2 border-cyan-400 animate-radar-spin shadow-[0_0_20px_#00f0ff]" />
                        <div className="w-6 h-6 rounded-full bg-[#073da8] shadow-[0_0_25px_#00f0ff] flex items-center justify-center text-white text-xs font-black">
                            G
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Compass Button */}
            <div className="absolute bottom-4 right-4 z-30">
                <button
                    onClick={() => alert('Map centered!')}
                    className="p-3 rounded-2xl glass-panel text-white hover:border-cyan-400 hover:shadow-cyan-500/30 shadow-2xl transition-all active:scale-95"
                >
                    <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                </button>
            </div>

        </div>
    );
};
