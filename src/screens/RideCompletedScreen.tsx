import React, { useState } from 'react';
import { Star, CheckCircle, MapPin, Calendar, DollarSign, Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { calculateFare } from '../constants/rides';

export const RideCompletedScreen: React.FC = () => {
    const { pickup, destination, distanceMiles, estimatedMinutes, selectedRide, submitRating } = useRide();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fare = calculateFare(selectedRide, distanceMiles);

    return (
        <div className="flex flex-col justify-between min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">

            <div className="text-center pt-4 my-auto space-y-4 max-w-md mx-auto w-full">

                {/* Animated Cyber Success Badge */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 text-white flex items-center justify-center text-4xl mx-auto shadow-[0_0_35px_#10b981] ring-4 ring-emerald-400/40 animate-float">
                    🎉
                </div>

                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
                        Trip Completed! <Sparkles className="w-5 h-5 text-cyan-400" />
                    </h1>
                    <p className="text-xs text-cyan-200/70 mt-1 font-semibold">
                        Your ride ended safely. Thank you for using GoNex.
                    </p>
                </div>

                {/* Itemized Receipt Card */}
                <div className="p-5 rounded-3xl glass-card border border-cyan-400/30 text-left space-y-3 shadow-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                            DIGITAL RECEIPT
                        </span>
                        <span className="text-xs font-bold text-gray-400">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <div className="text-xs font-bold space-y-1.5">
                        <p className="text-gray-400">Pickup: <strong className="text-white">{pickup}</strong></p>
                        <p className="text-gray-400">Dropoff: <strong className="text-white">{destination}</strong></p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                        <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
                            <span className="text-[9px] text-cyan-400 font-black block">DISTANCE</span>
                            <span className="text-xs font-extrabold text-white">{distanceMiles} mi</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
                            <span className="text-[9px] text-cyan-400 font-black block">DURATION</span>
                            <span className="text-xs font-extrabold text-white">{estimatedMinutes} min</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
                            <span className="text-[9px] text-cyan-400 font-black block">TOTAL FARE</span>
                            <span className="text-xs font-black text-cyan-300">${fare.finalFare.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Star Rating Widget */}
                <div className="p-5 rounded-3xl glass-panel border border-cyan-400/30 text-center space-y-3 shadow-2xl">
                    <h3 className="text-xs font-extrabold text-white">
                        Rate Your Driver & Experience
                    </h3>

                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-1 hover:scale-125 transition-transform active:scale-95"
                            >
                                <Star
                                    className={`w-7 h-7 ${star <= rating
                                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                                        : 'text-slate-700'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share feedback on your driver or trip... (Optional)"
                        className="w-full p-3 rounded-2xl glass-input text-xs font-semibold focus:outline-none text-white placeholder-gray-500"
                        rows={2}
                    />
                </div>

                <button
                    onClick={() => submitRating(rating)}
                    className="w-full py-4 bg-gradient-to-r from-[#0129d1] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98"
                >
                    Submit Rating & Return Home
                </button>

            </div>

        </div>
    );
};
