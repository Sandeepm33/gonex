import React from 'react';
import { CreditCard, Plus, Check, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useRide } from '../context/RideContext';

export const PaymentMethodsScreen: React.FC = () => {
    const { paymentMethods, selectedPayment, setSelectedPayment, goBack } = useRide();

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="Payment Options" showBack={true} />

            <div className="my-auto space-y-4 max-w-md mx-auto w-full pt-3">
                <h2 className="text-[10px] font-black uppercase text-cyan-400 tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Saved Cyber Payment Options
                </h2>

                <div className="space-y-3">
                    {paymentMethods.map((method) => {
                        const isSelected = selectedPayment.id === method.id;
                        return (
                            <div
                                key={method.id}
                                onClick={() => setSelectedPayment(method)}
                                className={`flex items-center justify-between p-4 rounded-3xl border cursor-pointer transition-all duration-300 ${isSelected
                                    ? 'glass-card border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-[1.01]'
                                    : 'glass-card border-cyan-500/20 hover:border-cyan-400/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-xl shadow-inner">
                                        {method.type === 'Visa' ? '💳' : method.type === 'Mastercard' ? '💳' : method.type === 'ApplePay' ? '🍏' : '💵'}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-sm text-white">
                                            {method.type} {method.last4 ? `•••• ${method.last4}` : ''}
                                        </h3>
                                        <p className="text-[11px] text-cyan-200/70 font-semibold">
                                            {method.isDefault ? 'Default Payment Method' : 'Secondary Account'}
                                        </p>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0129d1] to-cyan-400 text-white flex items-center justify-center shadow-[0_0_10px_#00f0ff]">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => alert('Add Payment Method modal')}
                    className="w-full py-4 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-3xl font-extrabold text-xs text-cyan-400 flex items-center justify-center gap-2 glass-panel hover:shadow-cyan-500/20 transition-all active:scale-98"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Digital Payment Card</span>
                </button>
            </div>

        </div>
    );
};
