import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    MapPin,
    Search,
    Navigation,
    Check,
    Clock,
    Sparkles,
    Home,
    Briefcase,
    Plane,
    Trees,
    ArrowUpDown,
    LocateFixed,
    X,
    Building2,
    Train,
    ShoppingBag,
    Landmark,
    Compass
} from 'lucide-react';
import { useRide } from '../context/RideContext';
import { MOCK_SAVED_PLACES } from '../constants/mockData';
import { searchPlaces, PlaceItem, reverseGeocode } from '../services/locationService';

export const LocationSearchScreen: React.FC = () => {
    const {
        pickup,
        destination,
        pickupCoords,
        destinationCoords,
        setPickupCoords,
        setDestinationCoords,
        confirmLocations,
        goBack,
        swapLocations,
        useCurrentLocation,
        isLocatingUser,
        setActiveMapSelectionMode,
        navigate
    } = useRide();

    const [pickupInput, setPickupInput] = useState(pickup);
    const [destInput, setDestInput] = useState(destination);
    const [activeInput, setActiveInput] = useState<'pickup' | 'destination'>('destination');

    const [suggestions, setSuggestions] = useState<PlaceItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setPickupInput(pickup);
    }, [pickup]);

    useEffect(() => {
        setDestInput(destination);
    }, [destination]);

    // Live autocomplete suggestion fetch as user types
    useEffect(() => {
        const query = activeInput === 'pickup' ? pickupInput : destInput;
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            const results = await searchPlaces(query);
            setSuggestions(results);
            setIsSearching(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [pickupInput, destInput, activeInput]);

    const handleSelectSuggestion = (place: PlaceItem) => {
        const coords: [number, number] = [place.lat, place.lng];
        if (activeInput === 'pickup') {
            setPickupInput(place.name);
            setPickupCoords(coords);
        } else {
            setDestInput(place.name);
            setDestinationCoords(coords);
        }
        setSuggestions([]);
    };

    const handleUseCurrentLocation = async () => {
        await useCurrentLocation();
    };

    const handleConfirm = () => {
        confirmLocations(
            pickupInput || 'Current Location',
            destInput || 'Downtown Chicago',
            pickupCoords,
            destinationCoords
        );
    };

    const renderPlaceIcon = (category: string = '') => {
        const className = "w-4 h-4 text-[#0221bf] dark:text-cyan-400";
        switch (category.toLowerCase()) {
            case 'airport':
            case 'plane':
            case '✈️':
                return <Plane className={className} />;
            case 'station':
            case 'train':
                return <Train className={className} />;
            case 'shopping':
                return <ShoppingBag className={className} />;
            case 'landmark':
                return <Landmark className={className} />;
            case 'business':
                return <Building2 className={className} />;
            case 'park':
            case 'trees':
            case '🌳':
                return <Trees className={className} />;
            case 'home':
            case '🏠':
                return <Home className={className} />;
            case 'work':
            case 'briefcase':
            case '💼':
                return <Briefcase className={className} />;
            default:
                return <MapPin className={className} />;
        }
    };

    return (
        <div className="flex flex-col h-full min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none overflow-y-auto">

            {/* Top Navigation Header */}
            <div className="flex items-center gap-3 pt-3 mb-4">
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
                    <p className="text-xs text-slate-600 dark:text-cyan-200/70 font-semibold">Google Maps style location search</p>
                </div>
            </div>

            {/* Cyber Dual Location Input Card */}
            <div className="p-4.5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/30 space-y-3.5 shadow-2xl relative">

                {/* Pickup Address Input */}
                <div
                    onClick={() => setActiveInput('pickup')}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${activeInput === 'pickup'
                        ? 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800'
                        }`}
                >
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <label className="block text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                            PICKUP LOCATION
                        </label>
                        <input
                            type="text"
                            value={pickupInput}
                            onChange={(e) => setPickupInput(e.target.value)}
                            onFocus={() => setActiveInput('pickup')}
                            placeholder="Search pickup place or address..."
                            className="w-full bg-transparent font-extrabold text-xs text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 truncate"
                        />
                    </div>
                    {pickupInput && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setPickupInput('');
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Center Action Row: Swap Button & Select on Map Button */}
                <div className="flex items-center justify-between px-2 py-0.5">
                    <button
                        onClick={swapLocations}
                        className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/15 border border-blue-200 dark:border-cyan-500/40 text-[#0221bf] dark:text-cyan-300 hover:border-cyan-400 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        title="Swap Pickup & Destination"
                    >
                        <ArrowUpDown className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" />
                        <span>Swap Locations</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveMapSelectionMode(activeInput);
                            goBack();
                        }}
                        className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        title="Select location on interactive map"
                    >
                        <Compass className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Select on Map</span>
                    </button>
                </div>

                {/* Destination Address Input */}
                <div
                    onClick={() => setActiveInput('destination')}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${activeInput === 'destination'
                        ? 'bg-[#0221bf]/10 dark:bg-cyan-500/10 border-[#0221bf]/60 dark:border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800'
                        }`}
                >
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0221bf] dark:bg-cyan-400 ring-4 ring-blue-500/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <label className="block text-[9px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-wider">
                            DESTINATION
                        </label>
                        <input
                            type="text"
                            value={destInput}
                            onChange={(e) => setDestInput(e.target.value)}
                            onFocus={() => setActiveInput('destination')}
                            placeholder="Where are you going?"
                            className="w-full bg-transparent font-extrabold text-xs text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 truncate"
                        />
                    </div>
                    {destInput && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDestInput('');
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

            </div>

            {/* "Use Current Location" Quick GPS Button */}
            <div className="mt-3">
                <button
                    onClick={handleUseCurrentLocation}
                    className="w-full p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-between shadow-sm active:scale-98 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
                            <LocateFixed className={`w-4 h-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-xs font-black">Use Current Location</h4>
                            <p className="text-[10px] text-emerald-700 dark:text-emerald-400/80 font-semibold">Detect GPS position automatically</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                        GPS Active
                    </span>
                </button>
            </div>

            {/* Real-time Autocomplete Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <div className="mt-4 space-y-1.5 animate-fadeIn">
                    <h3 className="text-[10px] font-black text-[#0221bf] dark:text-cyan-400 uppercase tracking-widest px-1">
                        Search Suggestions ({suggestions.length})
                    </h3>
                    <div className="space-y-2">
                        {suggestions.map((place) => (
                            <div
                                key={place.id}
                                onClick={() => handleSelectSuggestion(place)}
                                className="p-3.5 rounded-2xl glass-card hover:border-[#0221bf] dark:hover:border-cyan-400/60 cursor-pointer flex items-center justify-between transition-all active:scale-[0.99] group"
                            >
                                <div className="flex items-center gap-3.5 truncate">
                                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-950/80 border border-blue-200 dark:border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        {renderPlaceIcon(place.category)}
                                    </div>
                                    <div className="truncate">
                                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#0221bf] dark:group-hover:text-cyan-300 transition-colors truncate">
                                            {place.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 dark:text-gray-300 font-semibold truncate max-w-[240px]">
                                            {place.address}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-[#0221bf] dark:text-cyan-400 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 shrink-0">
                                    Select
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Favorites & Saved Places */}
            {suggestions.length === 0 && (
                <div className="mt-5 flex-1">
                    <h3 className="text-[10px] font-black text-[#0221bf] dark:text-cyan-400/80 uppercase tracking-widest mb-2.5">
                        Favorites & Popular Places
                    </h3>

                    <div className="space-y-2">
                        {MOCK_SAVED_PLACES.map((place) => (
                            <div
                                key={place.id}
                                onClick={() => {
                                    if (activeInput === 'pickup') {
                                        setPickupInput(place.address);
                                    } else {
                                        setDestInput(place.address);
                                    }
                                }}
                                className="flex items-center justify-between p-3.5 rounded-2xl glass-card hover:border-[#0221bf] dark:hover:border-cyan-400/50 cursor-pointer transition-all active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-950/80 border border-blue-200 dark:border-cyan-500/30 flex items-center justify-center shrink-0">
                                        {renderPlaceIcon(place.icon)}
                                    </div>
                                    <div className="truncate">
                                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{place.name}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">{place.address}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-[#0221bf] dark:text-cyan-400 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 shrink-0">
                                    Select
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Glowing Action Button */}
            <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-cyan-500/30 transition-all mt-4 border border-cyan-300/30 active:scale-98 shrink-0"
            >
                Confirm Route & View Vehicles
            </button>

        </div>
    );
};

