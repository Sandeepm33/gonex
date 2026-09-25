import React, { useState } from 'react';
import { Clock, Car, Calendar, DollarSign, ChevronRight, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useRide } from '../context/RideContext';

export const MyRidesScreen: React.FC = () => {
    const { rideHistory, scheduledRides, cancelScheduledRide, navigate } = useRide();
    const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');

    const activeScheduledRides = scheduledRides.filter(r => r.status === 'Scheduled');

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#040814] p-5 text-slate-900 dark:text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="My Trips" showBack={true} />

            {/* Cyber Tabs Pill */}
            <div className="flex glass-panel p-1 rounded-2xl my-4 border border-slate-200 dark:border-cyan-500/20 bg-white/80 dark:bg-[#051336]/80">
                <button
                    onClick={() => setTab('upcoming')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative ${tab === 'upcoming'
                        ? 'bg-gradient-to-r from-[#0221bf] to-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                >
                    Scheduled & Upcoming ({activeScheduledRides.length})
                </button>
                <button
                    onClick={() => setTab('history')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === 'history'
                        ? 'bg-gradient-to-r from-[#0221bf] to-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                >
                    Past History
                </button>
            </div>

            {/* Rides List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {tab === 'upcoming' ? (
                    activeScheduledRides.length === 0 ? (
                        <div className="text-center py-12 space-y-3 glass-card border border-slate-200 dark:border-cyan-500/20 rounded-3xl p-6 bg-white/90 dark:bg-slate-900/60">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 text-[#0221bf] dark:text-cyan-400 flex items-center justify-center text-3xl mx-auto border border-slate-200 dark:border-cyan-500/30 shadow-xl">
                                📅
                            </div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No Upcoming Scheduled Rides</h3>
                            <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs mx-auto">
                                Plan ahead by scheduling a ride for any future date and time.
                            </p>
                            <button
                                onClick={() => navigate('home')}
                                className="mt-3 px-6 py-3 bg-gradient-to-r from-[#0221bf] to-cyan-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/30 border border-cyan-300/30 active:scale-95"
                            >
                                Book a Ride Now or Later
                            </button>
                        </div>
                    ) : (
                        activeScheduledRides.map((item) => (
                            <div
                                key={item.id}
                                className="p-4.5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/40 space-y-3 hover:border-[#0221bf] dark:hover:border-cyan-400 transition-all shadow-xl text-slate-900 dark:text-white bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-sm text-[#0221bf] dark:text-cyan-400 flex items-center gap-1.5">
                                        <Car className="w-4 h-4" />
                                        {item.type} (Scheduled)
                                    </span>
                                    <span className="text-[10px] font-black text-[#0221bf] dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-cyan-500/40 flex items-center gap-1 shadow-sm">
                                        <Clock className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" />
                                        {item.scheduledTime}
                                    </span>
                                </div>

                                <div className="text-xs font-semibold text-slate-800 dark:text-gray-200 space-y-1.5 bg-slate-100/90 dark:bg-slate-950/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-cyan-500/20">
                                    <p className="truncate"><span className="text-slate-500 dark:text-gray-400 font-extrabold">Pickup:</span> <strong className="text-slate-900 dark:text-white">{item.pickup}</strong></p>
                                    <p className="truncate"><span className="text-slate-500 dark:text-gray-400 font-extrabold">Dropoff:</span> <strong className="text-slate-900 dark:text-white">{item.destination}</strong></p>
                                </div>

                                <div className="flex items-center justify-between pt-1 text-xs font-bold">
                                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" />
                                        Date: <strong className="text-slate-900 dark:text-white font-black">{item.scheduledDate}</strong>
                                    </span>
                                    <span className="text-lg font-black text-[#0221bf] dark:text-cyan-300">
                                        ${item.estimatedFare.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => cancelScheduledRide(item.id)}
                                    className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                >
                                    <XCircle className="w-4 h-4" /> Cancel Scheduled Ride
                                </button>
                            </div>
                        ))
                    )
                ) : (
                    rideHistory.map((item) => (
                        <div
                            key={item.id}
                            className="p-4.5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-500/20 space-y-3 hover:border-[#0221bf] dark:hover:border-cyan-400 transition-all shadow-xl text-slate-900 dark:text-white bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-black text-sm text-[#0221bf] dark:text-cyan-400 flex items-center gap-1.5">
                                    <Car className="w-4 h-4" />
                                    {item.type}
                                </span>
                                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    {item.status}
                                </span>
                            </div>

                            <div className="text-xs font-semibold text-slate-800 dark:text-gray-200 space-y-1.5 bg-slate-100/90 dark:bg-slate-950/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-cyan-500/20">
                                <p className="truncate"><span className="text-slate-500 dark:text-gray-400 font-extrabold">Pickup:</span> <strong className="text-slate-900 dark:text-white">{item.pickup}</strong></p>
                                <p className="truncate"><span className="text-slate-500 dark:text-gray-400 font-extrabold">Dropoff:</span> <strong className="text-slate-900 dark:text-white">{item.destination}</strong></p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-cyan-500/20 text-xs font-bold">
                                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" />
                                    {item.date}
                                </span>
                                <span className="text-lg font-black text-slate-900 dark:text-white">
                                    ${item.amount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};
