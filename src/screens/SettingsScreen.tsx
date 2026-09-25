import React from 'react';
import { User, Shield, Bell, CreditCard, Moon, Sun, Globe, HelpCircle, FileText, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useRide } from '../context/RideContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsScreen: React.FC = () => {
    const { navigate } = useRide();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-slate-900 dark:text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="Settings" showBack={true} />

            <div className="mt-3 mb-auto space-y-5 max-w-md mx-auto w-full">

                {/* Account Section */}
                <div>
                    <h3 className="text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-widest mb-2 flex items-center gap-1">
                       Account Preferences
                    </h3>
                    <div className="glass-card rounded-3xl border border-slate-200 dark:border-cyan-400/20 divide-y divide-slate-200 dark:divide-cyan-500/10 text-xs font-bold shadow-xl">
                        <button onClick={() => navigate('profile')} className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-t-3xl transition-colors text-slate-900 dark:text-white">
                            <span className="flex items-center gap-3"><User className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" /> Personal Information</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                        </button>
                        <button onClick={() => navigate('payment-methods')} className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-slate-900 dark:text-white">
                            <span className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" /> Payment Methods</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                        </button>
                        <button onClick={() => navigate('notifications')} className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-b-3xl transition-colors text-slate-900 dark:text-white">
                            <span className="flex items-center gap-3"><Bell className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" /> Notifications</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Appearance Section */}
                <div>
                    <h3 className="text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-widest mb-2">Appearance</h3>
                    <div className="glass-card rounded-3xl border border-slate-200 dark:border-cyan-400/20 p-4 flex items-center justify-between text-xs font-bold shadow-xl">
                        <span className="flex items-center gap-3 text-slate-900 dark:text-white">
                            {isDark ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                            App Theme ({isDark ? 'Cyber Obsidian' : 'Light Mode'})
                        </span>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-cyan-500' : 'bg-blue-600'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Support Section */}
                <div>
                    <h3 className="text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-widest mb-2">Support & Safety</h3>
                    <div className="glass-card rounded-3xl border border-slate-200 dark:border-cyan-400/20 divide-y divide-slate-200 dark:divide-cyan-500/10 text-xs font-bold shadow-xl">
                        <button onClick={() => navigate('help')} className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-t-3xl transition-colors text-slate-900 dark:text-white">
                            <span className="flex items-center gap-3"><HelpCircle className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" /> Help Center</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                        </button>
                        <button onClick={() => navigate('terms')} className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-b-3xl transition-colors text-slate-900 dark:text-white">
                            <span className="flex items-center gap-3"><FileText className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" /> Terms & Conditions</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export const HelpScreen: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-slate-900 dark:text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="Help Center" showBack={true} />

            <div className="mt-3 mb-auto space-y-4 max-w-md mx-auto w-full">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    How can we help? 
                </h2>
                <div className="space-y-3">
                    {[
                        "How is the fare calculated for GoNex Mini vs GoNex EV?",
                        "What is the cancellation policy?",
                        "How do I update my payment method?",
                        "How can I contact my assigned driver?"
                    ].map((faq, idx) => (
                        <div key={idx} className="p-4 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/20 font-extrabold text-xs space-y-2">
                            <p className="text-[#0221bf] dark:text-cyan-400">{faq}</p>
                            <p className="text-slate-600 dark:text-gray-300 font-normal leading-relaxed">Fares are calculated using Base Fare + Distance ($ per mile) + Wait time minutes, ensuring complete transparency.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const TermsScreen: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-slate-900 dark:text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="Terms & Conditions" showBack={true} />

            <div className="mt-3 mb-auto space-y-4 max-w-md mx-auto w-full text-xs font-semibold leading-relaxed text-slate-600 dark:text-cyan-200/80">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">GoNex Mobility Terms</h2>
                <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/20 space-y-3 text-slate-800 dark:text-white">
                    <p>1. Passenger safety and verified driver credentials guarantee.</p>
                    <p>2. GoNex Mini pricing: Base $5.00, Minimum $10.00, Per Mile $2.35, Per Minute Wait $0.00.</p>
                    <p>3. GoNex XL pricing: Base $10.00, Minimum $10.00, Per Mile $2.50, Per Minute Wait $1.25.</p>
                    <p>4. Dynamic fare estimation and automatic digital receipts.</p>
                </div>
            </div>
        </div>
    );
};
