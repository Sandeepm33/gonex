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
            <aside className="relative w-4/5 max-w-xs bg-white dark:bg-[#081226] h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto border-r border-gray-200 dark:border-cyan-500/20">

                {/* Top Header & User Profile Banner */}
                <div className="p-5 bg-gradient-to-br from-[#0129d1] via-blue-700 to-[#040814] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                            <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 uppercase">
                                GoNex
                            </span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* User Profile Card */}
                    <div
                        onClick={() => {
                            setSidebarOpen(false);
                            navigate('profile');
                        }}
                        className="flex items-center gap-3.5 cursor-pointer group relative z-10 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-all"
                    >
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-cyan-400/50 shadow-lg">
                            <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-extrabold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-[11px] text-cyan-200/80 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* User Stats Quick Bar */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold relative z-10">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/20 border border-white/5">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[11px]">480 Pts</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/20 border border-white/5">
                            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[11px]">14kg CO₂ saved</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Items List */}
                <div className="px-3 py-3 flex-1 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = currentScreen === item.screen;
                        return (
                            <button
                                key={item.screen}
                                onClick={() => {
                                    setSidebarOpen(false);
                                    navigate(item.screen);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-[#0129d1] to-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-cyan-400/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={isActive ? 'text-cyan-300' : 'text-[#0129d1] dark:text-cyan-400'}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isActive ? 'text-white' : ''}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Preferences & Logout */}
                <div className="p-3 border-t border-gray-100 dark:border-cyan-500/10 space-y-2 bg-gray-50/50 dark:bg-[#040814]/60">

                    {/* Theme Switcher Toggle */}
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-cyan-500/20">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-gray-700 dark:text-gray-200">
                            {isDark ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                            <span>{isDark ? 'Cyber Dark' : 'Light Mode'}</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDark ? 'bg-cyan-500' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-4' : 'translate-x-1'
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
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>

            </aside>
        </div>
    );
};
