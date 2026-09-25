import React from 'react';
import { Search, MapPin, Clock, ArrowRight, Compass, ShieldCheck, Zap, Sparkles, Calendar } from 'lucide-react';
import { Header } from '../components/Header';
import { MapView } from '../components/MapView';
import { useRide } from '../context/RideContext';
import { MOCK_SAVED_PLACES } from '../constants/mockData';

export const HomeScreen: React.FC = () => {
    const { pickup, setDestination, setBookingType, isMapMaximized, navigate } = useRide();

    return (
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-white overflow-hidden select-none">

            {/* 1. Interactive Google Map Background Container (Low Z-Index Stacking Context) */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <MapView showRoute={false} showDriver={false} />
            </div>

            {/* 2. Floating Header (High Z-Index above Map) */}
            {!isMapMaximized && (
                <div className="relative z-30 pointer-events-none">
                    <Header title="GoNex Cyber 2.0" showBack={false} />
                </div>
            )}

            {/* 3. Bottom Floating Glass Card HUD (High Z-Index above Map) */}
            {!isMapMaximized && (
                <div className="relative z-30 mt-auto p-5 glass-panel rounded-t-[42px] border-t border-slate-200 dark:border-cyan-400/30 shadow-2xl space-y-3.5 animate-slideUp text-slate-900 dark:text-white pointer-events-auto">

                    {/* Cyber Handle Indicator */}
                    <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-cyan-400/40 mx-auto" />

                    {/* Book Now vs Book for Later Quick Launch Pills */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => {
                                setBookingType('now');
                                navigate('location-search');
                            }}
                            className="p-3 rounded-2xl bg-gradient-to-r from-[#0221bf] to-blue-700 hover:from-blue-600 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 border border-blue-400/30 active:scale-95 transition-all"
                        >
                            <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
                            <span>Ride Now</span>
                        </button>

                        <button
                            onClick={() => {
                                setBookingType('later');
                                navigate('location-search');
                            }}
                            className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-400/40 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                        >
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>Book for Later</span>
                        </button>
                    </div>

                    {/* Floating Destination Search Box */}
                    <div
                        onClick={() => navigate('location-search')}
                        className="p-3.5 rounded-3xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-cyan-400/40 hover:border-[#0221bf] dark:hover:border-cyan-400 cursor-pointer transition-all duration-300 shadow-lg flex items-center justify-between group active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0221bf] to-cyan-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Search className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-widest flex items-center gap-1">
                                    WHERE WOULD YOU LIKE TO GO?
                                </span>
                                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    Search place or airport...
                                </h2>
                            </div>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-cyan-500/20 border border-blue-200 dark:border-cyan-400/40 text-[#0221bf] dark:text-cyan-300 flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-sm">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Current GPS Status Pill */}
                    <div className="px-3 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 truncate max-w-[200px]">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                            <span className="truncate text-xs font-bold">Pickup: {pickup}</span>
                        </div>

                        <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1 flex-shrink-0">
                            <ShieldCheck className="w-3 h-3" /> GPS Ready
                        </span>
                    </div>

                    {/* Quick Frequent Destinations */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0221bf] dark:text-cyan-400/80 mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Frequent Destinations
                        </h3>

                        <div className="space-y-1.5">
                            {MOCK_SAVED_PLACES.slice(0, 2).map((place) => (
                                <div
                                    key={place.id}
                                    onClick={() => {
                                        setDestination(place.address);
                                        navigate('route-preview');
                                    }}
                                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-cyan-500/20 hover:border-[#0221bf] dark:hover:border-cyan-400 cursor-pointer transition-all shadow-sm group active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-lg p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/20">{place.icon}</span>
                                        <div>
                                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#0221bf] dark:group-hover:text-cyan-300 transition-colors">{place.name}</h4>
                                            <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate max-w-[180px]">{place.address}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
