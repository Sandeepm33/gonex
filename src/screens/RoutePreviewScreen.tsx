import React from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, ChevronRight, Sparkles, Car } from 'lucide-react';
import { Header } from '../components/Header';
import { MapView } from '../components/MapView';
import { RideCard } from '../components/RideCard';
import { RideFareSheet } from '../components/RideFareSheet';
import { useRide } from '../context/RideContext';
import { RIDE_TYPES } from '../constants/rides';

export const RoutePreviewScreen: React.FC = () => {
    const { pickup, destination, distanceMiles, estimatedMinutes, navigate } = useRide();

    return (
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-white overflow-hidden select-none">
            <Header title="Route Trajectory" showBack={true} />

            {/* Interactive Vector Map View */}
            <div className="relative flex-1 w-full min-h-[300px]">
                <MapView showRoute={true} showDriver={false} />
            </div>

            {/* Bottom Floating Route Summary Panel */}
            <div className="relative z-20 glass-panel rounded-t-[40px] border-t border-slate-200 dark:border-cyan-400/30 p-6 shadow-2xl space-y-4 animate-slideUp text-slate-900 dark:text-white">

                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-cyan-500/20">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0221bf] dark:text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> ROUTE ANALYSIS
                        </span>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-gray-300 mt-1">
                            <span>Distance: <strong className="text-[#0221bf] dark:text-cyan-300 font-extrabold">{distanceMiles} mi</strong></span>
                            <span>Est. Travel Time: <strong className="text-[#0221bf] dark:text-cyan-300 font-extrabold">{estimatedMinutes} min</strong></span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-800 dark:text-gray-200">
                    <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-md" />
                        <span className="truncate">{pickup}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-[#0221bf] ring-2 ring-blue-400 dark:ring-cyan-400 shadow-md" />
                        <span className="truncate">{destination}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('ride-selection')}
                    className="w-full py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 border border-cyan-300/30"
                >
                    <span>Choose Vehicle Category</span>
                    <ChevronRight className="w-5 h-5" />
                </button>

            </div>
        </div>
    );
};

export const RideSelectionScreen: React.FC = () => {
    const {
        selectedRide,
        setSelectedRideId,
        fareSheetRideId,
        setFareSheetRideId,
        navigate,
    } = useRide();

    return (
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-slate-900 dark:text-white select-none">
            <Header title="Choose Vehicle Category" showBack={true} />

            {/* Clean Full-Screen Vehicle Selection List (No map container as requested) */}
            <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto max-w-lg mx-auto w-full">

                <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-cyan-500/20">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                                Available Vehicles ({RIDE_TYPES.length}) <Sparkles className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold">
                                Select a vehicle category for your journey
                            </p>
                        </div>
                        <span className="text-xs font-black text-[#0221bf] dark:text-cyan-400 bg-blue-50 dark:bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-cyan-500/30 shrink-0">
                            Instant Dispatch
                        </span>
                    </div>

                    <div className="space-y-3 pb-4">
                        {RIDE_TYPES.map((ride) => (
                            <RideCard
                                key={ride.id}
                                ride={ride}
                                isSelected={selectedRide.id === ride.id}
                                onSelect={() => setSelectedRideId(ride.id)}
                                onOpenDetails={() => setFareSheetRideId(ride.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="pt-4 sticky bottom-0 bg-gradient-to-t from-slate-100 dark:from-[#080d19] via-slate-100/90 dark:via-[#080d19]/90 to-transparent pb-4 backdrop-blur-md">
                    <button
                        onClick={() => navigate('confirm-ride')}
                        className="w-full py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 border border-cyan-300/30"
                    >
                        <Car className="w-5 h-5" />
                        <span>Confirm {selectedRide.name}</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* Fare Breakdown Sheet Modal */}
            <RideFareSheet
                rideId={fareSheetRideId}
                onClose={() => setFareSheetRideId(null)}
                onConfirm={(id) => {
                    setSelectedRideId(id);
                    navigate('confirm-ride');
                }}
            />
        </div>
    );
};
