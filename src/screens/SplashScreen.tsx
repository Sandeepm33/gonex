import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, Cpu, Radio, Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';
import gonexLogo from '../assets/gonexlogo.avif';

export const SplashScreen: React.FC = () => {
    const { navigate } = useRide();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        const timer = setTimeout(() => {
            navigate('onboarding');
        }, 2600);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-between min-h-screen cyber-bg-dark text-white p-6 sm:p-8 select-none animate-fadeIn relative overflow-hidden">

            {/* Deep Dark Blue Ambient Glowing Radar Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0221bf]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Status HUD */}
            <div className="w-full flex justify-between items-center z-10 pt-2">
                <div className="flex items-center gap-2 bg-[#051336]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#0221bf]/40 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-black uppercase text-cyan-300 tracking-wider flex items-center gap-1">
                        <Radio className="w-3 h-3 text-cyan-400" /> GoNex Neural Net
                    </span>
                </div>
                <span className="text-[11px] font-mono font-extrabold text-cyan-400/80 bg-slate-900/60 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    v2.5 MOBILITY
                </span>
            </div>

            {/* Central Branding & Logo */}
            <div className="flex flex-col items-center gap-6 text-center z-10 my-auto max-w-sm">

                {/* Glowing Logo Frame */}
                <div className="relative group">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#0221bf] via-cyan-400 to-blue-600 blur-lg opacity-80 group-hover:opacity-100 transition duration-1000 animate-pulse" />
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#030A1C] border-2 border-cyan-400/50 flex items-center justify-center p-3 shadow-2xl overflow-hidden">
                        <img
                            src={gonexLogo}
                            alt="GoNex Logo"
                            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.6)] animate-float"
                        />
                    </div>
                </div>

                {/* Brand Name & Acronym Breakdown */}
                <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 uppercase drop-shadow-md">
                        GoNex
                    </h1>
                    <p className="text-xs sm:text-sm text-cyan-300 font-extrabold tracking-widest uppercase flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Technology For Mobility
                    </p>

                    {/* Acronym Decoder Box */}
                    <div className="mt-4 p-3 rounded-2xl bg-[#051336]/90 border border-[#0221bf]/50 text-left space-y-1 shadow-lg backdrop-blur-md">
                        <p className="text-[10px] font-black uppercase text-cyan-400 tracking-wider text-center border-b border-cyan-500/20 pb-1 mb-1">
                            Platform Architecture
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-[10px] font-bold text-gray-300">
                            <span className="flex items-center gap-1 text-cyan-300"><span className="text-amber-400 font-black">G</span>lobal Dispatch</span>
                            <span className="flex items-center gap-1 text-cyan-300"><span className="text-amber-400 font-black">O</span>n-Demand AI</span>
                            <span className="flex items-center gap-1 text-cyan-300"><span className="text-amber-400 font-black">N</span>ext-Gen EV</span>
                            <span className="flex items-center gap-1 text-cyan-300"><span className="text-amber-400 font-black">EX</span>press Route</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom High-Tech Loading & Status HUD */}
            <div className="w-full max-w-xs flex flex-col items-center gap-3.5 z-10 pb-4">

                {/* Tech Status Badges */}
                <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-gray-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> GPS Locked
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-cyan-400">
                        <Cpu className="w-3.5 h-3.5" /> Neural AI Active
                    </span>
                </div>

                {/* Progress Scanner Bar */}
                <div className="w-full bg-[#051336] rounded-full h-2 border border-cyan-500/30 overflow-hidden relative shadow-inner">
                    <div
                        className="bg-gradient-to-r from-[#0221bf] via-cyan-400 to-blue-500 h-full transition-all duration-150 rounded-full shadow-[0_0_12px_#00f0ff]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <button
                    onClick={() => navigate('onboarding')}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0221bf] to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 border border-cyan-300/30 active:scale-95 transition-all"
                >
                    <span>Launch Mobility Suite</span>
                    <ArrowRight className="w-4 h-4" />
                </button>

            </div>

        </div>
    );
};

