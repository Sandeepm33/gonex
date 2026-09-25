import React from 'react';
import { Menu, ArrowLeft, Sun, Moon, Bell, Sparkles, Radio } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { useTheme } from '../context/ThemeContext';
import gonexLogo from '../assets/gonexlogo.avif';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'GoNex Mobility', showBack = false, onBack }) => {
    const { setSidebarOpen, goBack, unreadNotificationsCount, navigate } = useRide();
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="relative z-40 px-3 pt-3 pb-1.5 bg-transparent pointer-events-none">
            <div className="mx-auto flex items-center justify-between px-3 py-2 rounded-3xl glass-panel shadow-2xl pointer-events-auto transition-all duration-300 border border-slate-200/80 dark:border-cyan-400/40 hover:border-[#0221bf]/40 dark:hover:border-cyan-400/70">

                {/* Left Action Icon & Brand */}
                <div className="flex items-center gap-2.5 min-w-0">
                    {showBack ? (
                        <button
                            onClick={onBack || goBack}
                            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0221bf] via-blue-600 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-400 transition-all active:scale-95 shadow-md shadow-[#0221bf]/30 border border-cyan-300/40 flex items-center justify-center shrink-0"
                            title="Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0221bf] via-blue-600 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-400 transition-all active:scale-95 shadow-md shadow-[#0221bf]/30 border border-cyan-300/40 flex items-center justify-center shrink-0 group"
                            title="Open Navigation Menu"
                        >
                            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {/* Cyber Logo Badge & Title */}
                    <div className="flex items-center gap-2 cursor-pointer group min-w-0" onClick={() => navigate('home')}>
                        <div className="w-9 h-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <img src={gonexLogo} alt="GoNex" className="w-full h-full object-contain" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h1 className="font-black text-xs tracking-wider text-slate-900 dark:text-white uppercase leading-none truncate">
                                    {title}
                                </h1>
                                {/* <Sparkles className="w-3 h-3 text-[#0221bf] dark:text-cyan-400 shrink-0 animate-pulse" /> */}
                            </div>

                            {/* <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider uppercase flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                <span>ONLINE</span>
                            </span> */}
                        </div>
                    </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">

                    {/* Notifications Button */}
                    <button
                        onClick={() => navigate('notifications')}
                        className="relative p-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-cyan-500/30 transition-all active:scale-95 shadow-sm hover:border-[#0221bf] dark:hover:border-cyan-400"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-slate-900 animate-ping" />
                        )}
                    </button>

                    {/* Theme Switcher Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-cyan-500/30 transition-all active:scale-95 shadow-sm hover:border-[#0221bf] dark:hover:border-cyan-400"
                        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                    >
                        {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-[#0221bf]" />}
                    </button>

                </div>

            </div>
        </header>
    );
};
