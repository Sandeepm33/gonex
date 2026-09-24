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
        <header className="relative z-40 px-4 pt-7 pb-2 bg-transparent pointer-events-none">
            <div className="mx-auto flex items-center justify-between p-2 rounded-2xl glass-panel shadow-2xl pointer-events-auto transition-all duration-300 border border-white/20 dark:border-[#0221bf]/30">

                {/* Left Action Icon & Brand */}
                <div className="flex items-center gap-2.5">
                    {showBack ? (
                        <button
                            onClick={onBack || goBack}
                            className="p-2.5 rounded-2xl bg-[#0221bf] text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-[#0221bf]/30 border border-cyan-300/40"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2.5 rounded-2xl bg-[#0221bf] text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-[#0221bf]/30 border border-cyan-300/40 flex items-center justify-center"
                        >
                            <Menu className="w-4.5 h-4.5" />
                        </button>
                    )}

                    {/* Cyber Logo Badge & Title */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
                        <div className="w-10 h-10 p-1 bg-[#030A1C] border border-cyan-400/40 rounded-2xl flex items-center justify-center shadow-md shadow-[#0221bf]/40">
                            <img src={gonexLogo} alt="GoNex" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="font-black text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 uppercase">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1.5">

                    {/* Notifications Button */}
                    <button
                        onClick={() => navigate('notifications')}
                        className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-cyan-500/20 transition-all active:scale-95 shadow-sm"
                    >
                        <Bell className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-slate-900 animate-ping" />
                        )}
                    </button>

                    {/* Theme Switcher Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-cyan-500/20 transition-all active:scale-95 shadow-sm"
                    >
                        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0221bf]" />}
                    </button>

                </div>

            </div>
        </header>
    );
};
