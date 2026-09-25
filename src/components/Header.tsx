import React from 'react';
import { Menu, ArrowLeft, Sun, Moon, Bell } from 'lucide-react';
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
        <header className="relative z-40 px-3.5 pt-7 pb-2 bg-transparent pointer-events-none">
            <div className="mx-auto flex items-center justify-between p-2 rounded-2xl glass-panel shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,240,255,0.12)] pointer-events-auto transition-all duration-300 border border-white/60 dark:border-cyan-400/30">

                {/* Left Action Icon & Brand */}
                <div className="flex items-center gap-2.5">
                    {showBack ? (
                        <button
                            onClick={onBack || goBack}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-[#0221bf] to-blue-600 text-white hover:from-blue-600 hover:to-cyan-500 transition-all active:scale-95 shadow-md shadow-[#0221bf]/30 border border-cyan-300/40"
                            title="Back"
                        >
                            <ArrowLeft className="w-4.5 h-4.5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-[#0221bf] to-blue-600 text-white hover:from-blue-600 hover:to-cyan-500 transition-all active:scale-95 shadow-md shadow-[#0221bf]/30 border border-cyan-300/40 flex items-center justify-center group"
                            title="Open Navigation Menu"
                        >
                            <Menu className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {/* Cyber Logo Badge & Title */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('home')}>
                        <div className="w-14 h-14 flex items-center justify-center shrink-0">
                            <img src={gonexLogo} alt="GoNex" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="font-black text-xs tracking-wider text-slate-900 dark:text-white flex items-center gap-1 uppercase leading-none">
                                {title}
                            </h1>
                            <span className="text-[9px] font-extrabold text-[#0221bf] dark:text-cyan-400/90 tracking-widest uppercase flex items-center gap-1 mt-0.5">

                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1.5">

                    {/* Notifications Button */}
                    <button
                        onClick={() => navigate('notifications')}
                        className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-cyan-500/30 transition-all active:scale-95 shadow-sm"
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
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-cyan-500/30 transition-all active:scale-95 shadow-sm"
                        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                    >
                        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0221bf]" />}
                    </button>

                </div>

            </div>
        </header>
    );
};
