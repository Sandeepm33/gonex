import React from 'react';
import { X, Check, Info, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { RIDE_TYPES, calculateFare } from '../constants/rides';
import { useRide } from '../context/RideContext';

interface RideFareSheetProps {
    rideId: string | null;
    onClose: () => void;
    onConfirm: (rideId: string) => void;
}

export const RideFareSheet: React.FC<RideFareSheetProps> = ({
    rideId,
    onClose,
    onConfirm,
}) => {
    const { distanceMiles, estimatedMinutes } = useRide();

    if (!rideId) return null;
    const ride = RIDE_TYPES.find((r) => r.id === rideId) || RIDE_TYPES[0];
    const fare = calculateFare(ride, distanceMiles);

    return (
        <div className="fixed inset-0 z-50 flex items-end animate-fadeIn">
            {/* Backdrop overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Floating Bottom Sheet */}
            <div className="relative z-10 w-full max-w-md mx-auto bg-white dark:bg-dark-card rounded-t-3xl border-t border-gray-200 dark:border-dark-border p-6 shadow-2xl space-y-4 animate-slideUp text-gray-900 dark:text-white">

                {/* Handle Bar Indicator Pill */}
                <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto" />

                {/* Title Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{ride.image}</span>
                        <div>
                            <h2 className="text-xl font-black">{ride.name} Fare Breakdown</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Transparent pricing per mile</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-100 dark:bg-dark-surface text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Trip Metrics Pills */}
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border">
                        <span className="text-[10px] font-black uppercase text-gray-400 block">ESTIMATED DISTANCE</span>
                        <span className="text-base font-black text-gray-900 dark:text-white">{distanceMiles} mi</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border">
                        <span className="text-[10px] font-black uppercase text-gray-400 block">ESTIMATED TIME</span>
                        <span className="text-base font-black text-gray-900 dark:text-white">{estimatedMinutes} min</span>
                    </div>
                </div>

                {/* Detailed Breakdown List */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border space-y-2.5 text-xs font-semibold">

                    <div className="flex justify-between py-1">
                        <span className="text-gray-500">Base Fare</span>
                        <span className="font-bold">${ride.baseFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-1">
                        <span className="text-gray-500">
                            Per Mile Rate (${ride.perMile.toFixed(2)} × {distanceMiles} mi)
                        </span>
                        <span className="font-bold">${fare.distanceFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-1">
                        <span className="text-gray-500">Waiting Time Charge (${ride.perMinuteWait.toFixed(2)}/min)</span>
                        <span className="font-bold">${fare.waitingFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-t border-gray-200 dark:border-dark-border pt-2 text-gray-500">
                        <span>Minimum Fare Policy</span>
                        <span className="font-bold">${ride.minimumFare.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-dark-border text-sm font-extrabold text-[#0129d1] dark:text-white">
                        <span>Estimated Total Fare</span>
                        <span className="text-xl font-black">${fare.finalFare.toFixed(2)}</span>
                    </div>

                </div>

                {/* Action Button */}
                <button
                    onClick={() => {
                        onConfirm(ride.id);
                        onClose();
                    }}
                    className="w-full py-4 bg-[#0129d1] hover:bg-[#0020a8] text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    <span>Confirm {ride.name} Ride</span>
                </button>

            </div>
        </div>
    );
};
