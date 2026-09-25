import React from 'react';
import { CreditCard, Users, Clock, Calendar, Check, ChevronRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Header } from '../components/Header';
import { useRide, BookingType } from '../context/RideContext';
import { calculateFare } from '../constants/rides';
import { StandardXCarSVG, StandardXlSuvSVG } from '../components/VehicleIcons';

export const ConfirmRideScreen: React.FC = () => {
    const {
        selectedRide,
        pickup,
        destination,
        distanceMiles,
        estimatedMinutes,
        selectedPayment,
        confirmRideBooking,
        bookingType,
        setBookingType,
        scheduledDate,
        setScheduledDate,
        scheduledTime,
        setScheduledTime,
        navigate,
    } = useRide();

    const fare = calculateFare(selectedRide, distanceMiles);

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">
            <Header title="Confirm Booking" showBack={true} />

            <div className="my-auto space-y-4 max-w-md mx-auto w-full pt-2">

                {/* Ride Type Selector Pill: Ride Now vs Book for Later */}
                <div className="p-1 rounded-2xl glass-panel border border-slate-200 dark:border-cyan-400/30 flex gap-1 shadow-lg">
                    <button
                        onClick={() => setBookingType('now')}
                        className={`flex-1 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${bookingType === 'now'
                            ? 'bg-gradient-to-r from-[#0221bf] to-cyan-500 text-white shadow-md shadow-cyan-500/30 border border-cyan-300/40'
                            : 'text-slate-500 dark:text-gray-400 hover:text-white'
                            }`}
                    >
                        <Zap className="w-4 h-4 text-cyan-300" />
                        <span>Ride Now (Instant)</span>
                    </button>

                    <button
                        onClick={() => setBookingType('later')}
                        className={`flex-1 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${bookingType === 'later'
                            ? 'bg-gradient-to-r from-[#0221bf] to-cyan-500 text-white shadow-md shadow-cyan-500/30 border border-cyan-300/40'
                            : 'text-slate-500 dark:text-gray-400 hover:text-white'
                            }`}
                    >
                        <Calendar className="w-4 h-4 text-cyan-300" />
                        <span>Book for Later</span>
                    </button>
                </div>

                {/* Scheduled DateTime Picker Container when "Book for Later" is selected */}
                {bookingType === 'later' && (
                    <div className="p-4 rounded-3xl glass-card border border-cyan-400/50 bg-cyan-950/20 space-y-3 shadow-2xl animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-cyan-400" /> Schedule Date & Time
                            </h3>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                                Flexible Pickup
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Date</label>
                                <input
                                    type="date"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-cyan-400/30 text-xs font-extrabold text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Time</label>
                                <input
                                    type="time"
                                    value={scheduledTime.includes('AM') || scheduledTime.includes('PM') ? '10:30' : scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-cyan-400/30 text-xs font-extrabold text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        </div>

                        {/* Quick Date Presets */}
                        <div className="flex gap-2 text-[10px] font-extrabold pt-1">
                            <button
                                onClick={() => {
                                    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                                    setScheduledDate(tomorrow);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300"
                            >
                                Tomorrow
                            </button>
                            <button
                                onClick={() => {
                                    const inTwoDays = new Date(Date.now() + 172800000).toISOString().split('T')[0];
                                    setScheduledDate(inTwoDays);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300"
                            >
                                In 2 Days
                            </button>
                            <button
                                onClick={() => setScheduledTime('08:00 AM')}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300"
                            >
                                Morning 8:00 AM
                            </button>
                        </div>
                    </div>
                )}

                {/* Pickup & Destination Summary Card */}
                <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/30 space-y-3.5 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-lg" />
                        <div>
                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">PICKUP ADDRESS</span>
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white">{pickup}</p>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200 dark:border-cyan-500/20 ml-7" />

                    <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0221bf] ring-2 ring-blue-400 dark:ring-cyan-400 shadow-lg" />
                        <div>
                            <span className="text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-wider">DESTINATION</span>
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white">{destination}</p>
                        </div>
                    </div>
                </div>

                {/* Selected Vehicle Card Preview */}
                <div className="flex items-center justify-between p-4.5 rounded-3xl bg-gradient-to-r from-[#0221bf] via-blue-700 to-indigo-800 text-white border border-blue-400/40 dark:border-cyan-400 shadow-2xl">
                    <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 p-1 rounded-2xl bg-white/10 dark:bg-slate-950/80 border border-white/20 dark:border-cyan-500/30 flex items-center justify-center shrink-0">
                            {typeof selectedRide.image === 'string' && (selectedRide.image.startsWith('http') || selectedRide.image.startsWith('/') || selectedRide.image.startsWith('data:')) ? (
                                <img src={selectedRide.image} alt={selectedRide.name} className="w-full h-full object-contain rounded-xl drop-shadow-md" />
                            ) : selectedRide.id === 'standard-x' ? (
                                <StandardXCarSVG className="w-full h-full" />
                            ) : selectedRide.id === 'standard-xl' ? (
                                <StandardXlSuvSVG className="w-full h-full" />
                            ) : (
                                <span className="text-3xl">{selectedRide.image}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-white leading-tight flex items-center gap-1.5">
                                {selectedRide.name} <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                            </h3>
                            <p className="text-xs text-cyan-100 font-semibold">Capacity: {selectedRide.capacity} Passenger{selectedRide.capacity > 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-2xl font-black text-white tracking-tight">
                            ${fare.finalFare.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Details Grid & Payment Selector */}
                <div className="p-4 rounded-3xl glass-card border border-slate-200 dark:border-cyan-500/20 divide-y divide-slate-200 dark:divide-cyan-500/10 text-xs font-bold shadow-xl">
                    <div className="flex justify-between py-2">
                        <span className="text-slate-500 dark:text-gray-400">Estimated Distance</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{distanceMiles} mi</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-slate-500 dark:text-gray-400">Estimated Travel Time</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{estimatedMinutes} min</span>
                    </div>
                    <div
                        onClick={() => navigate('payment-methods')}
                        className="flex justify-between py-2 items-center cursor-pointer hover:text-[#0221bf] dark:hover:text-cyan-400 group"
                    >
                        <span className="text-slate-500 dark:text-gray-400 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                            Payment Option
                        </span>
                        <span className="font-extrabold text-[#0221bf] dark:text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            {selectedPayment.type} •••• {selectedPayment.last4 || '4242'}
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>

                {/* Confirm Booking Action Button */}
                <button
                    onClick={confirmRideBooking}
                    className="w-full py-4 bg-gradient-to-r from-[#073da8] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 border border-cyan-300/30 mt-4"
                >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{bookingType === 'later' ? `Schedule Ride for ${scheduledDate}` : 'Confirm Booking Now'}</span>
                    <ChevronRight className="w-5 h-5" />
                </button>

            </div>
        </div>
    );
};
