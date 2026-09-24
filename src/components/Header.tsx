import React from 'react';
import { Menu, ArrowLeft, Sun, Moon, Bell, Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'GoNex', showBack = false, onBack }) => {
    const { setSidebarOpen, goBack, unreadNotificationsCount, navigate } = useRide();
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="relative z-40 px-4 pt-7 pb-2 bg-transparent pointer-events-none">
            <div className="mx-auto flex items-center justify-between p-2 rounded-2xl glass-panel shadow-2xl pointer-events-auto transition-all duration-300 border border-white/20 dark:border-cyan-500/20">

                {/* Left Action Icon & Brand */}
                <div className="flex items-center gap-2.5">
                    {showBack ? (
                        <button
                            onClick={onBack || goBack}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800/80 hover:bg-[#0129d1] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-black transition-all text-gray-800 dark:text-gray-200 active:scale-95 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800/80 hover:bg-[#0129d1] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-black transition-all text-gray-800 dark:text-gray-200 active:scale-95 shadow-sm"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    )}

                    {/* Cyber Logo Badge & Title */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0129d1] to-cyan-400 text-white flex items-center justify-center font-black text-sm shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300/40">
                            <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <h1 className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1">

                    {/* Notifications Button */}
                    <button
                        onClick={() => navigate('notifications')}
                        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/70 text-gray-700 dark:text-gray-300 transition-all active:scale-95"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-slate-900 animate-ping" />
                        )}
                    </button>

                    {/* Theme Switcher Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/70 text-gray-700 dark:text-gray-300 transition-all active:scale-95"
                    >
                        {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-blue-600" />}
                    </button>

                </div>

            </div>
        </header>
    );
};
