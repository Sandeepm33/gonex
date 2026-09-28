import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, ArrowRight, Compass, ShieldCheck, Zap, Sparkles, Calendar, Home, Briefcase, Plane, Trees, Navigation, ArrowUpDown, X, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { MapView } from '../components/MapView';
import { useRide } from '../context/RideContext';
import { MOCK_SAVED_PLACES } from '../constants/mockData';
import { searchPlaces, PlaceItem } from '../services/locationService';

export const HomeScreen: React.FC = () => {
    const {
        pickup,
        setPickup,
        destination,
        setDestination,
        setPickupCoords,
        setDestinationCoords,
        bookingType,
        setBookingType,
        isMapMaximized,
        navigate,
        setMapCenter,
        setMapZoom,
        useCurrentLocation,
        isLocatingUser,
        swapLocations
    } = useRide();

    const [pickupQuery, setPickupQuery] = useState(pickup);
    const [destinationQuery, setDestinationQuery] = useState(destination);
    const [activeInput, setActiveInput] = useState<'pickup' | 'destination' | null>(null);
    const [searchResults, setSearchResults] = useState<PlaceItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setPickupQuery(pickup);
    }, [pickup]);

    useEffect(() => {
        setDestinationQuery(destination);
    }, [destination]);

    const handleSearch = async (query: string, type: 'pickup' | 'destination') => {
        if (type === 'pickup') setPickupQuery(query);
        else setDestinationQuery(query);

        setActiveInput(type);

        if (query.trim().length > 1) {
            setIsSearching(true);
            const results = await searchPlaces(query);
            setSearchResults(results);
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectPlace = (place: PlaceItem) => {
        if (activeInput === 'pickup') {
            setPickup(place.name);
            setPickupCoords([place.lat, place.lng]);
            setPickupQuery(place.name);
            setMapCenter([place.lat, place.lng]);
        } else {
            setDestination(place.name);
            setDestinationCoords([place.lat, place.lng]);
            setDestinationQuery(place.name);
            setMapCenter([place.lat, place.lng]);
            navigate('route-preview');
        }
        setSearchResults([]);
        setActiveInput(null);
    };

    const handleGpsClick = () => {
        useCurrentLocation();
    };

    const renderPlaceIcon = (iconName: string) => {
        const className = "w-4 h-4 text-[#0221bf] dark:text-cyan-400";
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
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-white overflow-hidden select-none">

            {/* 1. Interactive Google Map Background Container */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <MapView showRoute={false} showDriver={false} />
            </div>

            {/* 2. Floating Header */}
            {!isMapMaximized && (
                <div className="relative z-30 pointer-events-none">
                    <Header title="GoNex " showBack={false} />
                </div>
            )}

            {/* 3. Bottom Floating Glass Card HUD */}
            {!isMapMaximized && (
                <div className="relative z-30 mt-auto p-5 glass-panel rounded-t-[44px] border-t border-slate-200/80 dark:border-cyan-400/40 shadow-[0_-15px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_-15px_50px_rgba(0,240,255,0.15)] space-y-4 animate-slideUp text-slate-900 dark:text-white pointer-events-auto backdrop-blur-2xl">

                    {/* Cyber Handle Indicator */}
                    <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-cyan-400/40 mx-auto shadow-sm" />

                    {/* Book Now vs Book for Later Quick Launch Pills */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            onClick={() => setBookingType('now')}
                            className={`p-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${bookingType === 'now'
                                ? 'bg-gradient-to-r from-[#0221bf] via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-300/30'
                                : 'bg-slate-900/90 text-cyan-300 border border-cyan-400/30 hover:bg-slate-800'
                                }`}
                        >
                            <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
                            <span>Ride Now</span>
                        </button>

                        <button
                            onClick={() => setBookingType('later')}
                            className={`p-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${bookingType === 'later'
                                ? 'bg-gradient-to-r from-[#0221bf] via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-300/30'
                                : 'bg-slate-900/90 text-cyan-300 border border-cyan-400/30 hover:bg-slate-800'
                                }`}
                        >
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>Book for Later</span>
                        </button>
                    </div>

                    {/* Dual "From" & "To" Search Card Container */}
                    <div className="p-4 rounded-3xl bg-white/95 dark:bg-slate-950/95 border border-slate-200/90 dark:border-cyan-400/40 shadow-xl space-y-3 backdrop-blur-xl relative">

                        {/* Header Title */}
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0221bf] dark:text-cyan-400 flex items-center gap-1.5">
                                <Navigation className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" /> Plan Your Route
                            </span>
                            <button
                                onClick={swapLocations}
                                className="text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-300 bg-blue-50 dark:bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-cyan-500/30 flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title="Swap Pickup & Destination"
                            >
                                <ArrowUpDown className="w-3 h-3" /> Swap
                            </button>
                        </div>

                        {/* Dual Inputs with Live Autocomplete */}
                        <div className="relative flex items-center gap-2">
                            {/* Left Visual Dots & Connecting Line */}
                            <div className="flex flex-col items-center justify-between py-3 h-20 shrink-0 ml-1">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300 shadow-sm" />
                                <div className="w-0.5 h-8 bg-slate-300 dark:bg-cyan-500/40 border-l border-dashed border-slate-400" />
                                <span className="w-3 h-3 rounded-full bg-[#0221bf] dark:bg-cyan-400 ring-2 ring-blue-300 dark:ring-cyan-300 shadow-sm" />
                            </div>

                            {/* Center Live Input Boxes */}
                            <div className="flex-1 space-y-2.5">

                                {/* FROM (Pickup) Input Box */}
                                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 focus-within:border-[#0221bf] dark:focus-within:border-cyan-400 transition-all flex items-center justify-between">
                                    <div className="flex-1 pr-2">
                                        <span className="text-[8px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider block">
                                            FROM (PICKUP LOCATION)
                                        </span>
                                        <input
                                            type="text"
                                            value={pickupQuery}
                                            onChange={(e) => handleSearch(e.target.value, 'pickup')}
                                            onFocus={() => setActiveInput('pickup')}
                                            placeholder="Enter pickup location..."
                                            className="w-full bg-transparent text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
                                        />
                                    </div>

                                    {pickupQuery ? (
                                        <button
                                            onClick={() => {
                                                setPickupQuery('');
                                                setPickup('');
                                            }}
                                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    ) : null}

                                    <button
                                        onClick={handleGpsClick}
                                        className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 text-[10px] font-black flex items-center gap-1 shrink-0 ml-1 cursor-pointer"
                                        title="Use GPS Current Location"
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isLocatingUser ? 'animate-ping' : 'animate-pulse'}`} />
                                        {isLocatingUser ? 'Locating...' : 'GPS'}
                                    </button>
                                </div>

                                {/* TO (Destination) Input Box */}
                                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 focus-within:border-[#0221bf] dark:focus-within:border-cyan-400 transition-all flex items-center justify-between">
                                    <div className="flex-1 pr-2">
                                        <span className="text-[8px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-wider block">
                                            TO (DESTINATION LOCATION)
                                        </span>
                                        <input
                                            type="text"
                                            value={destinationQuery}
                                            onChange={(e) => handleSearch(e.target.value, 'destination')}
                                            onFocus={() => setActiveInput('destination')}
                                            placeholder="Search destination place, airport..."
                                            className="w-full bg-transparent text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
                                        />
                                    </div>

                                    {destinationQuery ? (
                                        <button
                                            onClick={() => {
                                                setDestinationQuery('');
                                                setDestination('');
                                            }}
                                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    ) : null}

                                    <Search className="w-4 h-4 text-[#0221bf] dark:text-cyan-400 shrink-0" />
                                </div>

                            </div>
                        </div>

                        {/* Live Autocomplete Suggestions Overlay Dropdown */}
                        {activeInput && searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-2 z-50 p-2 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-400/40 shadow-2xl space-y-1 max-h-60 overflow-y-auto backdrop-blur-2xl animate-fadeIn">
                                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 dark:border-cyan-500/20">
                                    <span className="text-[9px] font-black uppercase text-cyan-400">
                                        Suggestions for {activeInput === 'pickup' ? 'Pickup' : 'Destination'}
                                    </span>
                                    <button
                                        onClick={() => setActiveInput(null)}
                                        className="text-[9px] font-bold text-slate-400 hover:text-white"
                                    >
                                        Close
                                    </button>
                                </div>
                                {searchResults.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelectPlace(item)}
                                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-cyan-500/20 cursor-pointer flex items-center justify-between transition-all group"
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-cyan-500/20 border border-blue-200 dark:border-cyan-400/40 text-[#0221bf] dark:text-cyan-400 flex items-center justify-center shadow-sm shrink-0">
                                                <MapPin className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="truncate">
                                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#0221bf] dark:group-hover:text-cyan-400 transition-colors truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-300 truncate max-w-[240px] font-semibold">
                                                    {item.address}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg shrink-0">
                                            Select
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Direct View Route Action Button */}
                        <button
                            onClick={() => navigate('route-preview')}
                            className="w-full py-3 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 border border-cyan-300/30 mt-2"
                        >
                            <span>Find Vehicles & View Route</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>

                    </div>

                    {/* Quick Frequent Destinations */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0221bf] dark:text-cyan-400 flex items-center gap-1">
                                Frequent Destinations
                            </h3>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Fast dispatch</span>
                        </div>

                        <div className="space-y-2">
                            {MOCK_SAVED_PLACES.slice(0, 2).map((place) => (
                                <div
                                    key={place.id}
                                    onClick={() => {
                                        setDestination(place.address);
                                        setDestinationQuery(place.address);
                                        navigate('route-preview');
                                    }}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-white/90 dark:bg-[#051336]/80 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200/80 dark:border-cyan-500/25 hover:border-[#0221bf] dark:hover:border-cyan-400 cursor-pointer transition-all shadow-sm group active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-[#030A1C] border border-blue-200/80 dark:border-cyan-500/30 flex items-center justify-center shadow-sm">
                                            {renderPlaceIcon(place.icon)}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#0221bf] dark:group-hover:text-cyan-300 transition-colors">{place.name}</h4>
                                            <p className="text-[10px] text-slate-500 dark:text-gray-300 font-semibold truncate max-w-[200px]">{place.address}</p>
                                        </div>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-cyan-500/30 text-[#0221bf] dark:text-cyan-400 flex items-center justify-center group-hover:translate-x-1 transition-all">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
