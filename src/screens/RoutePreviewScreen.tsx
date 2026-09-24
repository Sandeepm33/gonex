import React from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, ChevronRight, Sparkles } from 'lucide-react';
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
            <div className="relative z-20 glass-panel rounded-t-[40px] border-t border-cyan-400/30 p-6 shadow-2xl space-y-4 animate-slideUp text-white">

                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> ROUTE ANALYSIS
                        </span>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-300 mt-1">
                            <span>Distance: <strong className="text-cyan-300 font-extrabold">{distanceMiles} mi</strong></span>
                            <span>Est. Travel Time: <strong className="text-cyan-300 font-extrabold">{estimatedMinutes} min</strong></span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-xs font-bold text-gray-200">
                    <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
                        <span className="truncate">{pickup}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-[#0221bf] ring-2 ring-cyan-400 shadow-md shadow-cyan-500/50" />
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
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-white overflow-hidden select-none">
            <Header title="Select Vehicle" showBack={true} />

            {/* Map Header Preview */}
            <div className="relative h-44 w-full">
                <MapView showRoute={true} showDriver={false} />
            </div>

            {/* Vehicle Category Cards List */}
            <div className="relative z-20 flex-1 glass-panel rounded-t-[40px] border-t border-cyan-400/30 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-extrabold text-white flex items-center gap-1.5">
                            Available Vehicles <Sparkles className="w-4 h-4 text-cyan-400" />
                        </h2>
                        <span className="text-xs font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/30">
                            Instant Dispatch
                        </span>
                    </div>

                    <div className="space-y-3">
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

                <div className="pt-5">
                    <button
                        onClick={() => navigate('confirm-ride')}
                        className="w-full py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 border border-cyan-300/30"
                    >
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
