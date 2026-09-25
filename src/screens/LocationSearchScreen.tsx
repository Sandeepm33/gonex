import React, { useState } from 'react';
import { ArrowLeft, MapPin, Search, Navigation, Check, Clock, Sparkles, Home, Briefcase, Plane, Trees } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { MOCK_SAVED_PLACES } from '../constants/mockData';

export const LocationSearchScreen: React.FC = () => {
    const { pickup, setPickup, destination, setDestination, confirmLocations, goBack } = useRide();
    const [pickupInput, setPickupInput] = useState(pickup);
    const [destInput, setDestInput] = useState(destination);

    const handleConfirm = () => {
        confirmLocations(pickupInput || '123 Main Street', destInput || 'Downtown Chicago');
    };

    const renderPlaceIcon = (iconName: string) => {
        const className = "w-5 h-5 text-[#0221bf] dark:text-cyan-400";
        switch (iconName) {
            case 'Home':
            case '🏠':
                return <Home className={className} />;
            case 'Work':
            case 'Briefcase':
            case '💼':
                return <Briefcase className={className} />;
            case 'Airport':
            case 'Plane':
            case '✈️':
                return <Plane className={className} />;
            case 'Park':
            case 'Trees':
            case '🌳':
                return <Trees className={className} />;
            default:
                return <MapPin className={className} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">

            {/* Top Navigation Header */}
            <div className="flex items-center gap-3 pt-3 mb-5">
                <button
                    onClick={goBack}
                    className="p-2.5 rounded-2xl glass-panel hover:border-[#0221bf] dark:hover:border-cyan-400 text-slate-800 dark:text-white transition-all active:scale-95 shadow-md"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        Plan Journey
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-cyan-200/70 font-semibold">Select pickup & destination points</p>
                </div>
            </div>

            {/* Cyber Dual Location Input Card */}
            <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/30 space-y-4 shadow-2xl">

                {/* Pickup Address Input */}
                <div className="flex items-center gap-3.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 shadow-lg" />
                    <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">PICKUP ADDRESS</label>
                        <input
                            type="text"
                            value={pickupInput}
                            onChange={(e) => setPickupInput(e.target.value)}
                            placeholder="Current location"
                            className="w-full bg-transparent font-extrabold text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-slate-300 dark:border-cyan-500/30 ml-7" />

                {/* Destination Input */}
                <div className="flex items-center gap-3.5">
                    <div className="w-4 h-4 rounded-full bg-[#0221bf] ring-4 ring-blue-500/30 shadow-lg" />
                    <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-wider">DESTINATION ADDRESS</label>
                        <input
                            type="text"
                            value={destInput}
                            onChange={(e) => setDestInput(e.target.value)}
                            placeholder="Where are you going?"
                            className="w-full bg-transparent font-extrabold text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
                        />
                    </div>
                </div>

            </div>

            {/* Quick Favorites & Saved Places */}
            <div className="mt-6 flex-1">
                <h3 className="text-[11px] font-black text-[#0221bf] dark:text-cyan-400/80 uppercase tracking-widest mb-3">
                    Favorites & Recent Searches
                </h3>

                <div className="space-y-2.5">
                    {MOCK_SAVED_PLACES.map((place) => (
                        <div
                            key={place.id}
                            onClick={() => {
                                setDestInput(place.address);
                            }}
                            className="flex items-center justify-between p-4 rounded-2xl glass-card hover:border-[#0221bf] dark:hover:border-cyan-400/50 cursor-pointer transition-all active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-950/80 border border-blue-200 dark:border-cyan-500/30 flex items-center justify-center shadow-sm">
                                    {renderPlaceIcon(place.icon)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{place.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-gray-400">{place.address}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-[#0221bf] dark:text-cyan-400 px-3 py-1 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30">
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
