import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';

export const ForgotPasswordScreen: React.FC = () => {
    const { navigate } = useRide();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSent(true);
    };

    return (
        <div className="flex flex-col justify-between min-h-screen cyber-bg-dark p-6 text-white transition-colors duration-200 select-none">
            <div className="flex items-center gap-3 pt-2">
                <button onClick={() => navigate('login')} className="p-2.5 rounded-2xl glass-panel hover:border-cyan-400 text-white">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-white">Reset Password</h1>
            </div>

            {!sent ? (
                <form onSubmit={handleSubmit} className="my-auto space-y-4 max-w-sm mx-auto w-full">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0129d1] to-cyan-400 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-[0_0_25px_#00f0ff]">
                            🔑
                        </div>
                        <h2 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                            Forgot your password? <Sparkles className="w-4 h-4 text-cyan-400" />
                        </h2>
                        <p className="text-xs text-cyan-200/70 mt-1 max-w-xs mx-auto font-semibold">
                            Enter your registered email address to receive password recovery instructions.
                        </p>
                    </div>

                    <div className="p-5 rounded-3xl glass-card border border-cyan-400/30 space-y-3 shadow-2xl">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-cyan-400 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="sandeep@email.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-[#0129d1] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98 mt-4"
                    >
                        Send Recovery Link
                    </button>
                </form>
            ) : (
                <div className="my-auto text-center space-y-4 max-w-sm mx-auto w-full">
                    <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto animate-bounce shadow-emerald-400/50" />
                    <h2 className="text-2xl font-black text-white">Recovery Email Sent!</h2>
                    <p className="text-xs text-cyan-200/80 max-w-xs mx-auto font-semibold">
                        We have dispatched password recovery instructions to <span className="font-bold text-cyan-300">{email}</span>.
                    </p>
                    <button
                        onClick={() => navigate('login')}
                        className="w-full py-4 glass-panel hover:border-cyan-400 font-extrabold text-sm rounded-2xl text-white active:scale-98"
                    >
                        Return to Login
                    </button>
                </div>
            )}

            <div />
        </div>
    );
};
