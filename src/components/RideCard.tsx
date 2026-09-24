import React, { useState } from 'react';
import { Users, Info, Clock, ChevronDown, ChevronUp, Sparkles, Leaf } from 'lucide-react';
import { RideType, calculateFare } from '../constants/rides';
import { useRide } from '../context/RideContext';

interface RideCardProps {
    ride: RideType;
    isSelected: boolean;
    onSelect: () => void;
    onOpenDetails?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({
    ride,
    isSelected,
    onSelect,
}) => {
    const { distanceMiles } = useRide();
    const fare = calculateFare(ride, distanceMiles);
    const [detailsOpen, setDetailsOpen] = useState(false);

    return (
        <div
            onClick={onSelect}
            className={`relative mt-3.5 rounded-3xl transition-all duration-300 cursor-pointer select-none overflow-hidden ${isSelected
                ? 'glass-card border-cyan-400 ring-2 ring-cyan-400/60 shadow-[0_0_30px_rgba(0,240,255,0.3)] scale-[1.01]'
                : 'glass-card hover:border-cyan-400/40 hover:shadow-lg'
                }`}
        >
            {/* Top Glowing Badge Strip */}
            {ride.id === 'standard-x' && (
                <div className="w-full bg-gradient-to-r from-[#073da8] via-blue-600 to-cyan-500 py-1 px-4 flex items-center justify-between">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-300" /> Most Popular
                    </span>
                    <span className="text-[10px] font-bold text-cyan-200">Fastest Pickup</span>
                </div>
            )}
            {ride.id === 'standard-xl' && (
                <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 py-1 px-4 flex items-center justify-between">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Users className="w-3 h-3" /> Group Choice
                    </span>
                    <span className="text-[10px] font-bold text-emerald-100">Extra Luggage</span>
                </div>
            )}
            {ride.id === 'green-ev' && (
                <div className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-1 px-4 flex items-center justify-between">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Eco Friendly EV
                    </span>
                    <span className="text-[10px] font-bold text-emerald-100">Zero Emissions</span>
                </div>
            )}

            {/* Main Card Content */}
            <div className="flex items-center justify-between p-4 gap-3">
                {/* Left: Vehicle Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 ${isSelected ? 'bg-gradient-to-tr from-[#073da8] to-cyan-500/30 ring-2 ring-cyan-400/50 scale-105' : 'bg-gray-100 dark:bg-slate-900 border border-white/10'}`}>
                        {ride.image}
                    </div>

                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-none">{ride.name}</h3>
                            <span className="shrink-0 px-2 py-0.5 rounded-md bg-blue-950/80 border border-cyan-400/30 text-cyan-400 text-[10px] font-extrabold flex items-center gap-1">
                                <Users className="w-3 h-3" /> {ride.capacity}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{ride.description}</p>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {ride.eta}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Price & Details button */}
                <div className="text-right shrink-0 space-y-1.5">
                    <span className="block text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        ${fare.finalFare.toFixed(2)}
                    </span>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetailsOpen((prev) => !prev);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800/80 hover:bg-[#073da8] text-gray-700 dark:text-cyan-300 hover:text-white border border-gray-200 dark:border-cyan-500/30 text-[10px] font-bold flex items-center gap-1 transition-all ml-auto active:scale-95"
                    >
                        <Info className="w-3 h-3" />
                        <span>{detailsOpen ? 'Hide' : 'Fare Details'}</span>
                        {detailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            {/* Expandable Fare Breakdown Drawer */}
            {detailsOpen && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="mx-3.5 mb-3.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-cyan-500/20 space-y-2 text-xs font-semibold animate-fadeIn"
                >
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#073da8] dark:text-cyan-400 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Transparent Pricing
                    </div>

                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                        <span>Base Fare</span>
                        <span className="text-gray-900 dark:text-white font-bold">${ride.baseFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                        <span>Distance ({distanceMiles} mi @ ${ride.perMile.toFixed(2)}/mi)</span>
                        <span className="text-gray-900 dark:text-white font-bold">${fare.distanceFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                        <span>Wait Time Rate (${ride.perMinuteWait.toFixed(2)}/min)</span>
                        <span className="text-gray-900 dark:text-white font-bold">${fare.waitingFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-cyan-500/20 text-xs font-extrabold text-[#073da8] dark:text-cyan-400">
                        <span>Estimated Total</span>
                        <span className="text-base text-gray-900 dark:text-white font-black">${fare.finalFare.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
