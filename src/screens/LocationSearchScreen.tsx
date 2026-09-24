import React, { useState } from 'react';
import { ArrowLeft, MapPin, Search, Navigation, Check, Clock, Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { MOCK_SAVED_PLACES } from '../constants/mockData';

export const LocationSearchScreen: React.FC = () => {
    const { pickup, setPickup, destination, setDestination, confirmLocations, goBack } = useRide();
    const [pickupInput, setPickupInput] = useState(pickup);
    const [destInput, setDestInput] = useState(destination);

    const handleConfirm = () => {
        confirmLocations(pickupInput || '123 Main Street', destInput || 'Downtown Chicago');
    };

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">

            {/* Top Navigation Header */}
            <div className="flex items-center gap-3 pt-3 mb-5">
                <button
                    onClick={goBack}
                    className="p-2.5 rounded-2xl glass-panel hover:border-cyan-400 text-white transition-all active:scale-95 shadow-md"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        Plan Journey <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h1>
                    <p className="text-xs text-cyan-200/70 font-semibold">Select pickup & destination points</p>
                </div>
            </div>

            {/* Cyber Dual Location Input Card */}
            <div className="p-5 rounded-3xl glass-card border border-cyan-400/30 space-y-4 shadow-2xl">

                {/* Pickup Address Input */}
                <div className="flex items-center gap-3.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/50" />
                    <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-emerald-400 tracking-wider">PICKUP ADDRESS</label>
                        <input
                            type="text"
                            value={pickupInput}
                            onChange={(e) => setPickupInput(e.target.value)}
                            placeholder="Current location"
                            className="w-full bg-transparent font-extrabold text-sm text-white focus:outline-none placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-cyan-500/30 ml-7" />

                {/* Destination Input */}
                <div className="flex items-center gap-3.5">
                    <div className="w-4 h-4 rounded-full bg-[#0221bf] ring-4  shadow-lg shadow-cyan-500/50" />
                    <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-cyan-400 tracking-wider">DESTINATION ADDRESS</label>
                        <input
                            type="text"
                            value={destInput}
                            onChange={(e) => setDestInput(e.target.value)}
                            placeholder="Where are you going?"
                            className="w-full bg-transparent font-extrabold text-sm text-white focus:outline-none placeholder-gray-500"
                        />
                    </div>
                </div>

            </div>

            {/* Quick Favorites & Saved Places */}
            <div className="mt-6 flex-1">
                <h3 className="text-[11px] font-black text-cyan-400/80 uppercase tracking-widest mb-3">
                    Favorites & Recent Searches
                </h3>

                <div className="space-y-2.5">
                    {MOCK_SAVED_PLACES.map((place) => (
                        <div
                            key={place.id}
                            onClick={() => {
                                setDestInput(place.address);
                            }}
                            className="flex items-center justify-between p-4 rounded-2xl glass-card hover:border-cyan-400/50 cursor-pointer transition-all active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="text-2xl p-2 rounded-xl bg-slate-950/80 border border-cyan-500/20">{place.icon}</span>
                                <div>
                                    <h4 className="text-sm font-extrabold text-white">{place.name}</h4>
                                    <p className="text-xs text-gray-400">{place.address}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-cyan-400 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                                Select
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Glowing Action Button */}
            <button
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 transition-all mt-4 border border-cyan-300/30 active:scale-98"
            >
                Confirm Route & Proceed
            </button>

        </div>
    );
};
