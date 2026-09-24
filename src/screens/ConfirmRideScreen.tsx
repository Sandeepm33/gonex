import React from 'react';
import { CreditCard, Users, Clock, Navigation, Check, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { useRide } from '../context/RideContext';
import { calculateFare } from '../constants/rides';

export const ConfirmRideScreen: React.FC = () => {
    const {
        selectedRide,
        pickup,
        destination,
        distanceMiles,
        estimatedMinutes,
        selectedPayment,
        confirmRideBooking,
        navigate,
    } = useRide();

    const fare = calculateFare(selectedRide, distanceMiles);

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">
            <Header title="Confirm Booking" showBack={true} />

            <div className="my-auto space-y-4 max-w-md mx-auto w-full pt-2">

                {/* Pickup & Destination Summary Card */}
                <div className="p-5 rounded-3xl glass-card border border-cyan-400/30 space-y-3.5 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                        <div>
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">PICKUP ADDRESS</span>
                            <p className="text-xs font-extrabold text-white">{pickup}</p>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-cyan-500/20 ml-7" />

                    <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0129d1] ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50" />
                        <div>
                            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">DESTINATION</span>
                            <p className="text-xs font-extrabold text-white">{destination}</p>
                        </div>
                    </div>
                </div>

                {/* Selected Vehicle Card Preview */}
                <div className="flex items-center justify-between p-4.5 rounded-3xl bg-gradient-to-r from-[#0129d1] via-blue-900 to-slate-900 border border-cyan-400 ring-2 ring-cyan-400/40 shadow-2xl">
                    <div className="flex items-center gap-3.5">
                        <span className="text-4xl p-2 rounded-2xl bg-slate-950/80 border border-cyan-500/30">{selectedRide.image}</span>
                        <div>
                            <h3 className="font-extrabold text-lg text-white leading-tight flex items-center gap-1.5">
                                {selectedRide.name} <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            </h3>
                            <p className="text-xs text-cyan-200/80 font-semibold">Capacity: {selectedRide.capacity} Passenger{selectedRide.capacity > 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-2xl font-black text-white tracking-tight">
                            ${fare.finalFare.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Details Grid & Payment Selector */}
                <div className="p-4 rounded-3xl glass-card border border-cyan-500/20 divide-y divide-cyan-500/10 text-xs font-bold shadow-xl">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-400">Estimated Distance</span>
                        <span className="font-extrabold text-white">{distanceMiles} mi</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-400">Estimated Travel Time</span>
                        <span className="font-extrabold text-white">{estimatedMinutes} min</span>
                    </div>
                    <div
                        onClick={() => navigate('payment-methods')}
                        className="flex justify-between py-2 items-center cursor-pointer hover:text-cyan-400 group"
                    >
                        <span className="text-gray-400 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-cyan-400" />
                            Payment Option
                        </span>
                        <span className="font-extrabold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            {selectedPayment.type} •••• {selectedPayment.last4 || '4242'}
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>

                {/* Confirm Booking Action Button */}
                <button
                    onClick={confirmRideBooking}
                    className="w-full py-4 bg-gradient-to-r from-[#0129d1] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 border border-cyan-300/30 mt-4"
                >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirm Booking Now</span>
                    <ChevronRight className="w-5 h-5" />
                </button>

            </div>
        </div>
    );
};
