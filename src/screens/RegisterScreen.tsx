import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, CreditCard, Calendar, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';

export const RegisterScreen: React.FC = () => {
    const { navigate, setSelectedPayment } = useRide();
    const { register } = useAuth();

    // Personal Info
    const [firstName, setFirstName] = useState('Sandeep');
    const [lastName, setLastName] = useState('Bhargav');
    const [email, setEmail] = useState('sandeep@email.com');
    const [phone, setPhone] = useState('+1 555 019 2834');
    const [password, setPassword] = useState('••••••••••••');

    // Payment Card Details (Mandated during Registration)
    const [cardName, setCardName] = useState('Sandeep Bhargav');
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
    const [expiry, setExpiry] = useState('12/28');
    const [cvv, setCvv] = useState('888');
    const [zipCode, setZipCode] = useState('60601');
    const [agreed, setAgreed] = useState(true);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // Register user profile
        register({ firstName, lastName, email, phone });

        // Save registered card as primary payment method
        setSelectedPayment({
            id: `p-${Date.now()}`,
            type: 'Visa',
            last4: cardNumber.slice(-4) || '4242',
            isDefault: true,
            expiry: expiry || '12/28'
        });

        navigate('otp');
    };

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none overflow-y-auto">

            {/* Top Header */}
            <div className="flex items-center gap-3 pt-2 mb-4">
                <button onClick={() => navigate('login')} className="p-2.5 rounded-2xl glass-panel hover:border-cyan-400 text-white">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-white flex items-center gap-1.5">
                        Create Account <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h1>
                    <p className="text-xs text-cyan-200/70 font-semibold">Step 1 of 2: Cyber Profile & Payment Setup</p>
                </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 my-auto pb-6">

                {/* Section 1: Personal Profile */}
                <div className="p-5 rounded-3xl glass-card border border-cyan-400/30 space-y-3 shadow-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
                        1. Personal Information
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">First Name</label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Last Name</label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Phone Number</label>
                        <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                        />
                    </div>
                </div>

                {/* Section 2: Payment Card Details */}
                <div className="p-5 rounded-3xl glass-card border border-cyan-400/30 space-y-3 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-cyan-400" />
                            2. Payment Card Details
                        </span>
                        <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3" /> Encrypted
                        </span>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Cardholder Name</label>
                        <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Name on card"
                            className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Card Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="4242 4242 4242 4242"
                                className="w-full pl-3.5 pr-12 py-3 rounded-2xl glass-input text-xs font-mono font-extrabold focus:outline-none text-cyan-300 tracking-wider"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">💳</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Expiry</label>
                            <input
                                type="text"
                                required
                                maxLength={5}
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="12/28"
                                className="w-full px-2 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-center focus:outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">CVV</label>
                            <input
                                type="password"
                                required
                                maxLength={4}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="888"
                                className="w-full px-2 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-center focus:outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Zip Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder="60601"
                                className="w-full px-2 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-center focus:outline-none text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2 pt-1 px-1">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 bg-slate-900 border-cyan-500/40"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-300">
                        I agree to <button type="button" onClick={() => navigate('terms')} className="text-cyan-400 font-extrabold hover:underline">Terms & Conditions</button>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!agreed}
                    className="w-full py-4 bg-gradient-to-r from-[#0129d1] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98 mt-2"
                >
                    Create Account & Save Card
                </button>

            </form>
        </div>
    );
};

export const OTPVerificationScreen: React.FC = () => {
    const { navigate } = useRide();
    const [otp, setOtp] = useState(['5', '8', '2', '9', '1', '4']);

    return (
        <div className="flex flex-col justify-between min-h-screen cyber-bg-dark p-6 text-white transition-colors duration-200 select-none">
            <div className="flex items-center gap-3 pt-2">
                <button onClick={() => navigate('register')} className="p-2.5 rounded-2xl glass-panel hover:border-cyan-400 text-white">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-white">OTP Verification</h1>
            </div>

            <div className="text-center my-auto space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0129d1] to-cyan-400 text-white flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_#00f0ff] ring-4 ring-cyan-300/30">
                    📱
                </div>

                <div>
                    <h2 className="text-lg font-black text-white">Enter Verification Code</h2>
                    <p className="text-xs text-cyan-200/70 mt-1 max-w-xs mx-auto font-semibold">
                        Enter the 6-digit code sent to your registered mobile number
                    </p>
                </div>

                {/* 6 PIN Boxes */}
                <div className="flex justify-center gap-2">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                                const newOtp = [...otp];
                                newOtp[idx] = e.target.value;
                                setOtp(newOtp);
                            }}
                            className="w-11 h-14 text-center text-xl font-extrabold rounded-2xl glass-input border-2 border-cyan-500/30 focus:border-cyan-400 text-cyan-300 focus:outline-none shadow-md"
                        />
                    ))}
                </div>

                <button type="button" className="text-xs font-extrabold text-cyan-400 hover:underline">
                    Resend OTP in 00:45
                </button>
            </div>

            <button
                onClick={() => navigate('home')}
                className="w-full py-4 bg-gradient-to-r from-[#0129d1] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98 mb-4"
            >
                Verify Code & Launch App
            </button>
        </div>
    );
};
