import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, CreditCard, Calendar, ShieldCheck, Check, Sparkles, MessageSquare, KeyRound, CheckCircle2 } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';

export const RegisterScreen: React.FC = () => {
    const { navigate, setSelectedPayment } = useRide();
    const { register } = useAuth();

    // Wizard Step State (1: Personal Info, 2: Payment Card)
    const [step, setStep] = useState<1 | 2>(1);

    // Personal Info (Step 1)
    const [firstName, setFirstName] = useState('Sandeep');
    const [lastName, setLastName] = useState('Bhargav');
    const [email, setEmail] = useState('sandeep@email.com');
    const [phone, setPhone] = useState('+1 555 019 2834');
    const [password, setPassword] = useState('••••••••••••');

    // Payment Card Details (Step 2)
    const [cardName, setCardName] = useState('Sandeep Bhargav');
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
    const [expiry, setExpiry] = useState('12/28');
    const [cvv, setCvv] = useState('888');
    const [zipCode, setZipCode] = useState('60601');
    const [agreed, setAgreed] = useState(true);

    const handleNextStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (firstName && lastName && email && phone && password) {
            setStep(2);
        }
    };

    const handleCompleteRegistration = (e: React.FormEvent) => {
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
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#040814] p-5 text-slate-900 dark:text-white transition-colors duration-200 select-none overflow-y-auto">

            {/* Top Header */}
            <div className="flex items-center gap-3 pt-2 mb-4">
                <button
                    type="button"
                    onClick={() => {
                        if (step === 2) {
                            setStep(1);
                        } else {
                            navigate('login');
                        }
                    }}
                    className="p-2.5 rounded-2xl glass-panel hover:border-[#0221bf] dark:hover:border-cyan-400 text-slate-800 dark:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                        Create Account <Sparkles className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-cyan-200/70 font-semibold">
                        Step {step} of 2: {step === 1 ? 'Personal Profile' : 'Payment Method Setup'}
                    </p>
                </div>
            </div>

            {/* Step Wizard Progress Bar */}
            <div className="flex items-center gap-2 mb-5 px-1">
                <div
                    onClick={() => setStep(1)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl cursor-pointer transition-all border ${step === 1
                        ? 'bg-gradient-to-r from-[#0221bf] to-blue-600 text-white border-cyan-400/50 shadow-md shadow-[#0221bf]/30 font-black text-xs'
                        : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-cyan-500/20 font-bold text-xs'
                        }`}
                >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${step === 1 ? 'bg-white text-[#0221bf]' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-cyan-400'}`}>1</span>
                    <span>Personal Details</span>
                </div>

                <div
                    onClick={() => {
                        if (firstName && lastName && email) setStep(2);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl transition-all border ${step === 2
                        ? 'bg-gradient-to-r from-[#0221bf] to-blue-600 text-white border-cyan-400/50 shadow-md shadow-[#0221bf]/30 font-black text-xs'
                        : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-cyan-500/20 font-bold text-xs opacity-80'
                        }`}
                >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${step === 2 ? 'bg-white text-[#0221bf]' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-cyan-400'}`}>2</span>
                    <span>Add Payment</span>
                </div>
            </div>

            {/* STEP 1: Personal Details Form */}
            {step === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-4 my-auto pb-6 animate-fadeIn">
                    <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/30 space-y-3.5 shadow-2xl bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl">
                        <div className="flex items-center justify-between pb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0221bf] dark:text-cyan-400 flex items-center gap-1.5">
                                <User className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" /> 1. Personal Information
                            </span>
                            <span className="text-[9px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Step 1 of 2</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First Name"
                                    className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                    className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@email.com"
                                    className="w-full pl-3.5 pr-10 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-slate-900 dark:text-white"
                                />
                                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 555 000 0000"
                                    className="w-full pl-3.5 pr-10 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-slate-900 dark:text-white"
                                />
                                <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create strong password"
                                    className="w-full pl-3.5 pr-10 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-slate-900 dark:text-white"
                                />
                                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-black text-base rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98 mt-3 flex items-center justify-center gap-2"
                    >
                        <span>Continue to Add Payment</span>
                        <Sparkles className="w-4 h-4" />
                    </button>
                </form>
            )}

            {/* STEP 2: Payment Card Details Form */}
            {step === 2 && (
                <form onSubmit={handleCompleteRegistration} className="space-y-4 my-auto pb-6 animate-fadeIn">
                    <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-cyan-400/30 space-y-3.5 shadow-2xl bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0221bf] dark:text-cyan-400 flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                                2. Payment Card Details
                            </span>
                            <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200 dark:border-emerald-500/30">
                                <ShieldCheck className="w-3 h-3" /> Encrypted
                            </span>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Cardholder Name</label>
                            <input
                                type="text"
                                required
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="Name on card"
                                className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Card Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="4242 4242 4242 4242"
                                    className="w-full pl-3.5 pr-12 py-3 rounded-2xl glass-input text-xs font-mono font-extrabold focus:outline-none text-[#0221bf] dark:text-cyan-300 tracking-wider"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">💳</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-[9px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Expiry</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={5}
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    placeholder="12/28"
                                    className="w-full px-2 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-center focus:outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">CVV</label>
                                <input
                                    type="password"
                                    required
                                    maxLength={4}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="888"
                                    className="w-full px-2 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-center focus:outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-slate-600 dark:text-gray-400 mb-1">Zip Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    placeholder="60601"
                                    className="w-full px-2 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-center focus:outline-none text-slate-900 dark:text-white"
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
                            className="w-4 h-4 rounded text-[#0221bf] dark:text-cyan-400 focus:ring-blue-400 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-cyan-500/40"
                        />
                        <label htmlFor="terms" className="text-xs text-slate-700 dark:text-gray-300 font-bold">
                            I agree to <button type="button" onClick={() => navigate('terms')} className="text-[#0221bf] dark:text-cyan-400 font-black hover:underline">Terms & Conditions</button>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-1/3 py-4 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-cyan-500/30 active:scale-95"
                        >
                            ← Back
                        </button>
                        <button
                            type="submit"
                            disabled={!agreed}
                            className="w-2/3 py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98"
                        >
                            Create Account & Save
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export const OTPVerificationScreen: React.FC = () => {
    const { navigate } = useRide();
    const [otp, setOtp] = useState(['5', '8', '2', '9', '1', '4']);
    const [copiedNotification, setCopiedNotification] = useState(false);

    const handleAutoFill = () => {
        setOtp(['5', '8', '2', '9', '1', '4']);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2500);
    };

    return (
        <div className="flex flex-col justify-between min-h-screen bg-slate-50 dark:bg-[#040814] p-5 text-slate-900 dark:text-white transition-colors duration-200 select-none overflow-y-auto">

            {/* Top Navigation */}
            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={() => navigate('register')}
                    className="p-2.5 rounded-2xl glass-panel hover:border-[#0221bf] dark:hover:border-cyan-400 text-slate-800 dark:text-white transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
                </div>
            </div>

            {/* Main Center Content */}
            <div className="text-center my-auto py-6 space-y-6 max-w-sm mx-auto w-full">

                {/* Vector Lock Icon Circular Orb */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0221bf]/30 via-blue-500/20 to-cyan-400/30 animate-pulse blur-xl" />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0221bf] via-blue-600 to-cyan-400 text-white flex items-center justify-center text-3xl shadow-2xl ring-4 ring-blue-300/40 dark:ring-cyan-300/30 z-10">
                        <KeyRound className="w-9 h-9 stroke-[2.5]" />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                        Verification Code
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-cyan-200/70 mt-1.5 font-bold leading-relaxed">
                        Please enter the 6-digit security code sent to
                    </p>
                    <span className="inline-block mt-1 text-xs font-black text-[#0221bf] dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 px-3 py-1 rounded-xl border border-blue-200 dark:border-cyan-500/30">
                        +1 555 *** 2834
                    </span>
                </div>

                {/* 6 Digit Input Grid */}
                <div className="flex justify-center gap-2.5 pt-2">
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
                            className="w-11 h-14 text-center text-2xl font-black rounded-2xl glass-input border-2 border-slate-200 dark:border-cyan-500/30 focus:border-[#0221bf] dark:focus:border-cyan-400 text-[#0221bf] dark:text-cyan-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 shadow-lg transition-all"
                        />
                    ))}
                </div>

                {/* Resend Code Badge */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={handleAutoFill}
                        className="text-xs font-black text-[#0221bf] dark:text-cyan-400 hover:underline inline-flex items-center gap-1.5 bg-blue-50 dark:bg-cyan-500/10 px-4 py-2 rounded-2xl border border-blue-200 dark:border-cyan-500/30 shadow-sm"
                    >
                        <span>Didn't receive code? Resend OTP in 00:45</span>
                    </button>
                </div>
            </div>

            {/* Bottom Primary Button */}
            <div className="pb-4">
                <button
                    onClick={() => navigate('home')}
                    className="w-full py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-black text-base rounded-2xl shadow-xl shadow-cyan-500/30 transition-all border border-cyan-300/30 active:scale-98 flex items-center justify-center gap-2"
                >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verify Code & Launch App</span>
                </button>
            </div>
        </div>
    );
};
