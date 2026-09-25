import React, { useEffect, useState } from 'react';
import { Loader2, X, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { MapView } from '../components/MapView';
import { DriverCard } from '../components/DriverCard';
import { useRide } from '../context/RideContext';
import { calculateFare } from '../constants/rides';

export const SearchingDriverScreen: React.FC = () => {
    const { selectedRide, cancelRide, navigate } = useRide();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('active-ride');
        }, 0);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-white overflow-hidden select-none">
            <Header title="Scanning Drivers" showBack={false} />

            {/* Sonar Radar Map View */}
            <div className="relative flex-1 w-full min-h-[340px]">
                <MapView showRoute={true} isSearching={true} />
            </div>

            {/* Searching Driver Cyber HUD Panel */}
            <div className="relative z-20 glass-panel rounded-t-[40px] border-t border-slate-200 dark:border-cyan-400/30 p-6 shadow-2xl space-y-4 animate-slideUp text-slate-900 dark:text-white">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="relative flex items-center justify-center">
                            <span className="w-9 h-9 rounded-full bg-blue-500/20 dark:bg-cyan-400/20 animate-ping absolute" />
                            <Loader2 className="w-7 h-7 text-[#0221bf] dark:text-cyan-400 animate-spin" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                                Finding GoNex Driver <Zap className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400 animate-pulse" />
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-cyan-200/70 font-semibold">Scanning 3.2 mi radius...</p>
                        </div>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 text-[#0221bf] dark:text-cyan-400 text-xs font-black">
                        {selectedRide.name}
                    </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-cyan-500/20 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-gray-400">Estimated Dispatch</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        ~ 3-4 minutes
                    </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                    <button
                        onClick={cancelRide}
                        className="w-1/3 py-3.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs rounded-2xl border border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                    >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                    </button>

                    <button
                        onClick={() => navigate('active-ride')}
                        className="w-2/3 py-3.5 bg-gradient-to-r from-[#0221bf] to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98"
                    >
                        Skip Simulation ➔
                    </button>
                </div>

            </div>
        </div>
    );
};

export const ActiveRideScreen: React.FC = () => {
    const { driver, selectedRide, distanceMiles, completeRide, cancelRide } = useRide();
    const [etaMinutes, setEtaMinutes] = useState(18);

    const fare = calculateFare(selectedRide, distanceMiles);

    useEffect(() => {
        const timer = setInterval(() => {
            setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-slate-900 dark:text-white overflow-hidden select-none">
            <Header title="Live Navigation" showBack={false} />

            {/* Live Driver Map Tracking */}
            <div className="relative flex-1 w-full min-h-[300px]">
                <MapView showRoute={true} showDriver={true} />
            </div>

            {/* Active Driver Cyber Glass HUD */}
            <div className="relative z-20 glass-panel rounded-t-[40px] border-t border-slate-200 dark:border-cyan-400/30 p-5 shadow-2xl space-y-4 animate-slideUp text-slate-900 dark:text-white">

                {/* Driver Card Component */}
                <DriverCard
                    driver={driver}
                    eta={`${etaMinutes} min`}
                    onCall={() => alert(`Calling driver ${driver.name} at ${driver.phone}...`)}
                    onMessage={() => alert(`Opening chat with driver ${driver.name}...`)}
                />

                {/* Trip Progress Bar */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-cyan-500/20 text-xs font-bold">
                    <div>
                        <span className="text-slate-500 dark:text-gray-400 block uppercase text-[10px]">Total Fare</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                            ${fare.finalFare.toFixed(2)}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="text-slate-500 dark:text-gray-400 block uppercase text-[10px]">Trip Status</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            En Route
                        </span>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={cancelRide}
                        className="w-1/3 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-gray-300 font-bold text-xs rounded-2xl border border-slate-300 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={completeRide}
                        className="w-2/3 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all border border-emerald-300/30 active:scale-98"
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete Trip</span>
                    </button>
                </div>

            </div>
        </div>
    );
};
