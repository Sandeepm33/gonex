import React, { useState } from 'react';
import { Users, Info, Clock, ChevronDown, ChevronUp, Sparkles, Leaf, Shield, Award } from 'lucide-react';
import { RideType, calculateFare } from '../constants/rides';
import { useRide } from '../context/RideContext';
import { StandardXCarSVG, StandardXlSuvSVG } from './VehicleIcons';

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
            className={`relative rounded-3xl transition-all duration-300 cursor-pointer select-none overflow-hidden ${isSelected
                ? 'glass-card border-cyan-400/90 ring-2 ring-cyan-400/60 shadow-[0_0_35px_rgba(0,240,255,0.35)] dark:shadow-[0_0_35px_rgba(0,240,255,0.25)] scale-[1.015]'
                : 'glass-card hover:border-cyan-400/50 hover:shadow-xl opacity-90 hover:opacity-100'
                }`}
        >
            {/* Top Glowing Badge Strip */}
            {ride.badge && (
                <div className={`w-full py-1.5 px-4 flex items-center justify-between text-white text-[10px] font-black uppercase tracking-widest ${ride.id === 'standard-x'
                    ? 'bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500'
                    }`}>
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" /> {ride.badge}
                    </span>
                    <span className="font-extrabold opacity-95 text-[9px] tracking-wider">{ride.capacity} Passengers</span>
                </div>
            )}

            {/* Main Card Content */}
            <div className="flex items-center justify-between p-4 gap-3">
                {/* Left: Vehicle Icon & Details */}
                <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-16 h-16 shrink-0 rounded-2xl p-1 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-gradient-to-tr from-[#0221bf] to-cyan-500/40 ring-2 ring-cyan-300/80 scale-105 shadow-md shadow-cyan-500/20' : 'bg-slate-100 dark:bg-[#030A1C] border border-slate-200 dark:border-cyan-500/30'}`}>
                        {typeof ride.image === 'string' && (ride.image.startsWith('http') || ride.image.startsWith('/') || ride.image.startsWith('data:')) ? (
                            <img src={ride.image} alt={ride.name} className="w-full h-full object-contain rounded-xl drop-shadow-md" />
                        ) : ride.id === 'standard-x' ? (
                            <StandardXCarSVG className="w-full h-full" />
                        ) : ride.id === 'standard-xl' ? (
                            <StandardXlSuvSVG className="w-full h-full" />
                        ) : (
                            <span className="text-3xl">{ride.image}</span>
                        )}
                    </div>

                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-base text-slate-900 dark:text-white leading-none tracking-tight">{ride.name}</h3>
                            <span className="shrink-0 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-cyan-500/20 border border-blue-200 dark:border-cyan-400/40 text-[#0221bf] dark:text-cyan-300 text-[10px] font-black flex items-center gap-1">
                                <Users className="w-3 h-3 text-[#0221bf] dark:text-cyan-400" /> {ride.capacity}
                            </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-gray-300 font-extrabold truncate">{ride.description}</p>
                        <div className="flex items-center gap-2 text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {ride.eta}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Highlighted Price & Details button */}
                <div className="text-right shrink-0 space-y-1.5">
                    <span className="block text-2xl font-black text-[#0221bf] dark:text-cyan-400 tracking-tight drop-shadow-sm">
                        ${fare.finalFare.toFixed(2)}
                    </span>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetailsOpen((prev) => !prev);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-[#0221bf] text-slate-800 dark:text-cyan-300 hover:text-white border border-slate-200 dark:border-cyan-500/30 text-[10px] font-black flex items-center gap-1 transition-all ml-auto active:scale-95 shadow-sm"
                    >
                        <Info className="w-3.5 h-3.5" />
                        <span>{detailsOpen ? 'Hide' : 'Fare Details'}</span>
                        {detailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Expandable Fare Breakdown Drawer */}
            {detailsOpen && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="mx-3.5 mb-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-[#030A1C]/90 border border-slate-200 dark:border-cyan-500/30 space-y-2 text-xs font-bold animate-fadeIn backdrop-blur-xl"
                >
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#0221bf] dark:text-cyan-400 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Transparent Pricing Formula
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px] font-extrabold">
                        <span>Base Ride Fare</span>
                        <span className="text-slate-900 dark:text-white font-black">${ride.baseFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px] font-extrabold">
                        <span>Distance ({distanceMiles} mi @ ${ride.perMile.toFixed(2)}/mi)</span>
                        <span className="text-slate-900 dark:text-white font-black">${fare.distanceFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px] font-extrabold">
                        <span>Wait Rate (${ride.perMinuteWait.toFixed(2)}/min)</span>
                        <span className="text-slate-900 dark:text-white font-black">${fare.waitingFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-cyan-500/30 text-xs font-black text-[#0221bf] dark:text-cyan-400">
                        <span>Total Estimated Fare</span>
                        <span className="text-base text-slate-900 dark:text-white font-black">${fare.finalFare.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
