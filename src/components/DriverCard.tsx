import React from 'react';
import { Star, Phone, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { DriverType } from '../context/RideContext';

interface DriverCardProps {
    driver: DriverType;
    eta?: string;
    onCall?: () => void;
    onMessage?: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
    driver,
    eta = '18 min',
    onCall,
    onMessage,
}) => {
    return (
        <div className="p-4.5 rounded-3xl glass-panel shadow-2xl space-y-3.5 border border-cyan-400/30">

            {/* Top Driver Status Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-200 dark:border-cyan-500/20">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0129d1] dark:text-cyan-400 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-cyan-400 animate-pulse" /> YOUR DRIVER IS EN ROUTE
                    </span>
                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                        Arriving in <span className="text-cyan-400 animate-pulse">{eta}</span>
                    </h2>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/40">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
            </div>

            {/* Driver Profile Row */}
            <div className="flex items-center justify-between pt-1">

                <div className="flex items-center gap-3.5">
                    <div className="relative">
                        <img
                            src={driver.avatar}
                            alt={driver.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-xl"
                        />
                        <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg bg-amber-400 text-gray-950 text-[10px] font-black flex items-center gap-0.5 shadow-md">
                            <Star className="w-2.5 h-2.5 fill-current text-gray-950" />
                            {driver.rating}
                        </span>
                    </div>

                    <div>
                        <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-tight">
                            {driver.name}
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {driver.vehicleModel || driver.vehicle} • {driver.vehicleColor || driver.color}
                        </p>

                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-lg bg-slate-900 text-cyan-400 text-[11px] font-mono font-extrabold tracking-widest border border-cyan-500/30 shadow-md">
                            {driver.licensePlate || driver.plate}
                        </span>

                    </div>
                </div>

                {/* Quick Action Buttons (Call & Message) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onCall}
                        className="w-11 h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 border border-emerald-300/30"
                    >
                        <Phone className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onMessage}
                        className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0129d1] to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 border border-cyan-300/40"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>

            </div>

        </div>
    );
};
