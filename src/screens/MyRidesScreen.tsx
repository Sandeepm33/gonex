import React, { useState } from 'react';
import { Clock, Car, Calendar, DollarSign, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useRide } from '../context/RideContext';

export const MyRidesScreen: React.FC = () => {
    const { rideHistory, navigate } = useRide();
    const [tab, setTab] = useState<'upcoming' | 'history'>('history');

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="My Trips" showBack={true} />

            {/* Cyber Tabs Pill */}
            <div className="flex glass-panel p-1 rounded-2xl my-4 border border-cyan-500/20">
                <button
                    onClick={() => setTab('upcoming')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === 'upcoming'
                        ? 'bg-gradient-to-r from-[#073da8] to-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setTab('history')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === 'history'
                        ? 'bg-gradient-to-r from-[#073da8] to-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    History
                </button>
            </div>

            {/* Rides List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {tab === 'upcoming' ? (
                    <div className="text-center py-12 space-y-3 glass-card rounded-3xl p-6">
                        <div className="w-16 h-16 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center text-3xl mx-auto border border-cyan-500/30 shadow-xl">
                            🏎️
                        </div>
                        <h3 className="font-extrabold text-base text-white">No Upcoming Trips</h3>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">
                            Book a high-speed, eco-friendly ride whenever you're ready to travel.
                        </p>
                        <button
                            onClick={() => navigate('home')}
                            className="mt-3 px-6 py-3 bg-gradient-to-r from-[#073da8] to-cyan-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/30 border border-cyan-300/30 active:scale-95"
                        >
                            Book a Ride Now
                        </button>
                    </div>
                ) : (
                    rideHistory.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 rounded-3xl glass-card border border-cyan-500/20 space-y-2 hover:border-cyan-400 transition-all shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-extrabold text-sm text-cyan-400 flex items-center gap-1.5">
                                    <Car className="w-4 h-4" />
                                    {item.type}
                                </span>
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    {item.status}
                                </span>
                            </div>

                            <div className="text-xs font-semibold text-gray-200 space-y-1">
                                <p className="truncate"><span className="text-gray-400">Pickup:</span> {item.pickup}</p>
                                <p className="truncate"><span className="text-gray-400">Dropoff:</span> {item.destination}</p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-xs font-bold">
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                    {item.date}
                                </span>
                                <span className="text-base font-black text-white">
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
