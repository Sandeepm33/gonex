import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ShieldCheck, X, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { MapView } from '../components/MapView';
import { DriverCard } from '../components/DriverCard';
import { useRide } from '../context/RideContext';
import { calculateFare } from '../constants/rides';

export const ActiveRideScreen: React.FC = () => {
    const { driver, selectedRide, distanceMiles, completeRide, cancelRide } = useRide();
    const [etaMinutes, setEtaMinutes] = useState(18);

    const fare = calculateFare(selectedRide, distanceMiles);

    useEffect(() => {
        const timer = setInterval(() => {
            setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex flex-col h-full min-h-screen bg-slate-950 text-white overflow-hidden">
            <Header title="Your Active Ride" showBack={false} />

            {/* Live Driver Map Tracking */}
            <div className="relative flex-1 w-full min-h-[300px]">
                <MapView showRoute={true} showDriver={true} />
            </div>

            {/* Active Driver Floating Panel */}
            <div className="relative z-20 bg-white dark:bg-dark-card rounded-t-3xl border-t border-gray-200 dark:border-dark-border p-5 shadow-2xl space-y-4 animate-slideUp text-gray-900 dark:text-white">

                {/* Driver Card */}
                <DriverCard
                    driver={driver}
                    eta={`${etaMinutes} min`}
                    onCall={() => alert(`Calling driver ${driver.name} at ${driver.phone}...`)}
                    onMessage={() => alert(`Opening chat window with driver ${driver.name}...`)}
                />

                {/* Trip Progress Pill */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border text-xs font-bold">
                    <div>
                        <span className="text-gray-400 block uppercase text-[10px]">Total Price</span>
                        <span className="text-lg font-black text-[#073da8] dark:text-white">
                            ${fare.finalFare.toFixed(2)}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="text-gray-400 block uppercase text-[10px]">Ride Status</span>
                        <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            In Progress
                        </span>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={cancelRide}
                        className="w-1/3 py-3.5 bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={completeRide}
                        className="w-2/3 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete Ride (Simulate)</span>
                    </button>
                </div>

            </div>
        </div>
    );
};
