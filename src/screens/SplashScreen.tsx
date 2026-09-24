import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';

export const SplashScreen: React.FC = () => {
    const { navigate } = useRide();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('onboarding');
        }, 2200);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-between min-h-screen cyber-bg-dark text-white p-8 select-none animate-fadeIn relative overflow-hidden">

            {/* Ambient Background Glowing Halos */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <div className="w-full flex justify-between items-center z-10">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> GoNex Cyber
                </span>
                <span className="text-xs text-cyan-400/60 font-mono font-bold">v2.0.0</span>
            </div>

            <div className="flex flex-col items-center gap-5 text-center z-10 my-auto">
                {/* Glowing Logo Emblem */}
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#0129d1] via-blue-600 to-cyan-400 flex items-center justify-center text-white text-5xl font-black shadow-[0_0_50px_#00f0ff] ring-4 ring-cyan-300/40 animate-float">
                    G
                </div>

                <div>
                    <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 uppercase">
                        GoNex
                    </h1>
                    <p className="text-sm text-cyan-200/80 font-bold tracking-wide mt-1">
                        Future of Urban Mobility
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 z-10">
                <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#00f0ff]" />
                <span className="text-xs text-cyan-300/70 font-bold tracking-wider">
                    Initializing Cyber System...
                </span>
            </div>
        </div>
    );
};
