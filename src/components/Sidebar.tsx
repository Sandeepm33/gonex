import React from 'react';
import {
    Home,
    Car,
    Clock,
    CreditCard,
    Bell,
    User,
    Settings,
    HelpCircle,
    FileText,
    Moon,
    Sun,
    LogOut,
    X,
    ChevronRight,
    Leaf,
    Award
} from 'lucide-react';
import { useRide, ScreenType } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import gonexLogo from '../assets/gonexlogo.avif';

export const Sidebar: React.FC = () => {
    const { sidebarOpen, setSidebarOpen, navigate, currentScreen } = useRide();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    if (!sidebarOpen) return null;

    const navItems: { label: string; icon: React.ReactNode; screen: ScreenType }[] = [
        { label: 'Home Dashboard', icon: <Home className="w-4 h-4" />, screen: 'home' },
        { label: 'Book a Ride', icon: <Car className="w-4 h-4" />, screen: 'location-search' },
        { label: 'My Active Rides', icon: <Car className="w-4 h-4" />, screen: 'my-rides' },
        { label: 'Ride History', icon: <Clock className="w-4 h-4" />, screen: 'ride-history' },
        { label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" />, screen: 'payment-methods' },
        { label: 'Notifications', icon: <Bell className="w-4 h-4" />, screen: 'notifications' },
        { label: 'My Profile', icon: <User className="w-4 h-4" />, screen: 'profile' },
        { label: 'Settings', icon: <Settings className="w-4 h-4" />, screen: 'settings' },
        { label: 'Help & Support', icon: <HelpCircle className="w-4 h-4" />, screen: 'help' },
        { label: 'Terms & Safety', icon: <FileText className="w-4 h-4" />, screen: 'terms' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Overlay Backdrop */}
            <div
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fadeIn"
            />

            {/* Drawer Container */}
            <aside className="relative w-4/5 max-w-xs bg-white dark:bg-[#051336] h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto border-r border-slate-200 dark:border-cyan-400/30 text-slate-900 dark:text-white backdrop-blur-2xl">

                {/* Top Header & User Profile Banner */}
                <div className="p-5 bg-gradient-to-br from-[#0221bf] via-blue-700 to-[#011580] text-white relative overflow-hidden border-b border-cyan-400/30">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <img src={gonexLogo} alt="GoNex Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 uppercase block leading-none">
                                    GoNex
                                </span>
                                <span className="text-[9px] font-black text-cyan-300 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> VIP EDITION
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95 border border-white/20"
                            title="Close Menu"
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    {/* User Profile Card */}
                    <div
                        onClick={() => {
                            setSidebarOpen(false);
                            navigate('profile');
                        }}
                        className="flex items-center gap-3.5 cursor-pointer group relative z-10 p-3 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 hover:border-cyan-300/60 transition-all shadow-md"
                    >
                        <div className="relative w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-cyan-400/70 shadow-lg shrink-0">
                            <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-black text-xs text-white truncate group-hover:text-cyan-200 transition-colors uppercase tracking-wide">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-[10px] text-cyan-200/90 font-extrabold truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* User Stats Quick Bar */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold relative z-10">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/30 border border-white/15 shadow-inner">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] font-black text-white">480 VIP Pts</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/30 border border-white/15 shadow-inner">
                            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-black text-white">14kg CO₂ saved</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Items List */}
                <div className="px-3 py-3 flex-1 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = currentScreen === item.screen;
                        return (
                            <button
                                key={item.screen}
                                onClick={() => {
                                    setSidebarOpen(false);
                                    navigate(item.screen);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-[#0221bf] to-blue-600 text-white shadow-lg shadow-[#0221bf]/30 border border-cyan-400/40 scale-[1.01]'
                                    : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#081D4F]/80 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl flex items-center justify-center transition-colors ${isActive
                                        ? 'bg-white/20 text-white shadow-inner'
                                        : 'bg-slate-100 dark:bg-slate-800/90 text-[#0221bf] dark:text-cyan-400 border border-slate-200 dark:border-cyan-500/30'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-black text-xs">{item.label}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white opacity-100 translate-x-0.5' : 'text-slate-400 dark:text-slate-400 opacity-60'}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Preferences & Logout */}
                <div className="p-3 border-t border-slate-200 dark:border-cyan-500/30 space-y-2 bg-slate-50 dark:bg-[#030A1C]">

                    {/* Theme Switcher Toggle */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#051336] border border-slate-200 dark:border-cyan-500/40 shadow-sm">
                        <div className="flex items-center gap-2.5 text-xs font-black text-slate-900 dark:text-slate-100">
                            {isDark ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                            <span>{isDark ? 'Cyber Dark' : 'Light Theme'}</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors border border-slate-300 dark:border-cyan-500/40 ${isDark ? 'bg-[#0221bf]' : 'bg-slate-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${isDark ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            setSidebarOpen(false);
                            logout();
                            navigate('login');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-black text-red-600 dark:text-red-400 bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors shadow-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Account</span>
                    </button>
                </div>

            </aside>
        </div>
    );
};
