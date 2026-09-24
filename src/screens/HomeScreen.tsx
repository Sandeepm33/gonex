import React from 'react';
import { Search, MapPin, Clock, ArrowRight, Compass, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { MapView } from '../components/MapView';
import { useRide } from '../context/RideContext';
import { MOCK_SAVED_PLACES } from '../constants/mockData';

export const HomeScreen: React.FC = () => {
    const { pickup, setDestination, navigate } = useRide();

    return (
        <div className="relative flex flex-col h-full min-h-screen cyber-bg-dark text-white overflow-hidden select-none">

            {/* Translucent Floating Header */}
            <Header title="GoNex Cyber 2.0" showBack={false} />

            {/* Interactive Futuristic Map background */}
            <div className="absolute inset-0 w-full h-full">
                <MapView showRoute={false} showDriver={false} />
            </div>

            {/* Bottom Floating Glass Card HUD */}
            <div className="relative z-30 mt-auto p-5 glass-panel rounded-t-[42px] border-t border-cyan-400/30 shadow-[0_-20px_60px_rgba(0,240,255,0.2)] space-y-4 animate-slideUp">

                {/* Cyber Handle Indicator */}
                <div className="w-12 h-1.5 rounded-full bg-cyan-400/40 mx-auto" />

                {/* Floating Destination Search Box */}
                <div
                    onClick={() => navigate('location-search')}
                    className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-400/40 hover:border-cyan-400 cursor-pointer transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.2)] flex items-center justify-between group active:scale-[0.99]"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0129d1] to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_#00f0ff] group-hover:scale-110 transition-transform">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-400 fill-current animate-pulse" />
                                WHERE WOULD YOU LIKE TO GO?
                            </span>
                            <h2 className="text-sm font-extrabold text-white">
                                Search location or airport...
                            </h2>
                        </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-md">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Current GPS Status Pill */}
                <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-emerald-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="truncate max-w-[220px] text-xs">Pickup: {pickup}</span>
                    </div>

                    <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> GPS Ready
                    </span>
                </div>

                {/* Quick Frequent Destinations */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Frequent Destinations
                    </h3>

                    <div className="space-y-2">
                        {MOCK_SAVED_PLACES.slice(0, 3).map((place) => (
                            <div
                                key={place.id}
                                onClick={() => {
                                    setDestination(place.address);
                                    navigate('route-preview');
                                }}
                                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400 cursor-pointer transition-all shadow-md group active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl p-2 rounded-xl bg-slate-950 border border-cyan-500/20">{place.icon}</span>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-white group-hover:text-cyan-300 transition-colors">{place.name}</h4>
                                        <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{place.address}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
