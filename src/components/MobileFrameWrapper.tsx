import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, Zap } from 'lucide-react';
import { useRide } from '../context/RideContext';
import gonexLogo from '../assets/gonexlogo.avif';

interface MobileFrameWrapperProps {
    children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
    const [isFrameEnabled, setIsFrameEnabled] = useState(true);
    const { pickup } = useRide();

    return (
        <div className="min-h-screen cyber-bg-dark text-slate-900 dark:text-white flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans antialiased relative overflow-hidden">

            {/* Ambient Background Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0221bf]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Top Floating Controls Bar */}
            <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-3 text-xs font-bold text-slate-600 dark:text-gray-400 z-50">
                <div className="flex items-center gap-2 bg-white/90 dark:bg-[#051336]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#0221bf]/20 dark:border-[#0221bf]/30 shadow-lg">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <img src={gonexLogo} alt="GoNex" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[#0221bf] dark:text-white font-extrabold tracking-wider text-[11px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#0221bf] via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-300 dark:to-indigo-300">
                        GoNex Mobility Tech
                    </span>
                </div>

                <button
                    onClick={() => setIsFrameEnabled(!isFrameEnabled)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/60 hover:border-cyan-400/50 text-slate-700 dark:text-gray-300 hover:text-[#0221bf] dark:hover:text-white transition-all shadow-md"
                >
                    {isFrameEnabled ? <Monitor className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" /> : <Smartphone className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" />}
                    <span className="text-xs font-semibold">{isFrameEnabled ? 'Full Screen' : 'Device Frame'}</span>
                </button>
            </div>

            {/* Main Mobile Device Container */}
            <div
                className={`w-full transition-all duration-500 ease-out ${isFrameEnabled
                    ? 'max-w-[410px] h-[860px] rounded-[52px] border-[10px] border-slate-900 dark:border-slate-950 ring-1 ring-cyan-500/30 shadow-[0_0_60px_rgba(0,240,255,0.25)] relative overflow-hidden flex flex-col bg-[#F0F4F9] dark:bg-[#040814]'
                    : 'max-w-md min-h-screen sm:min-h-[850px] sm:rounded-3xl border border-slate-300 dark:border-slate-800 relative overflow-hidden bg-[#F0F4F9] dark:bg-[#040814] shadow-2xl'
                    }`}
            >

                {/* Dynamic Island HUD (Frame Mode) */}
                {/* {isFrameEnabled && (
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 w-32 h-7 bg-slate-950/90 backdrop-blur-xl rounded-full flex items-center justify-between px-3 border border-white/10 shadow-2xl pointer-events-auto">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {pickup && (
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider animate-pulse flex items-center gap-1">
                                    <Zap className="w-2.5 h-2.5" /> LIVE
                                </span>
                            )}
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                    </div>
                )} */}

                {/* Screen Content Wrapper */}
                <div className="flex-1 relative flex flex-col h-full overflow-hidden">
                    {children}
                </div>

            </div>

        </div>
    );
};
