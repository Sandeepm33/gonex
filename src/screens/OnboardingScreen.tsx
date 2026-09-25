import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useRide } from '../context/RideContext';
import gonexLogo from '../assets/gonexlogo.avif';

export const OnboardingScreen: React.FC = () => {
    const { navigate } = useRide();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Future of Urban Mobility",
            subtitle: "Experience high-speed, instant ride dispatches with transparent pricing and cyber live tracking.",
            icon: "🏎️",
            bgGradient: "from-[#0221bf] to-cyan-500/30",
        },
        {
            title: "Choose Your Fleet",
            subtitle: "Select GoNex Mini, GoNex XL, or GoNex EV based on your passenger capacity and luxury needs.",
            icon: "⚡",
            bgGradient: "from-blue-600 to-indigo-900/40",
        },
        {
            title: "Seamless Cyber Navigation",
            subtitle: "Track your route trajectory with real-time vector sonar maps and verified pro drivers.",
            icon: "📍",
            bgGradient: "from-emerald-500/40 to-cyan-500/30",
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            navigate('login');
        }
    };

    const current = slides[currentSlide];

    return (
        <div className="flex flex-col justify-between min-h-screen cyber-bg-dark p-6 text-slate-900 dark:text-white transition-colors duration-200 select-none">

            {/* Top Bar with Skip */}
            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <img src={gonexLogo} alt="GoNex" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black text-base text-slate-900 dark:text-white tracking-wider flex items-center gap-1">
                        GoNex <Sparkles className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" />
                    </span>
                </div>

                <button
                    onClick={() => navigate('login')}
                    className="text-xs font-bold text-[#0221bf] dark:text-cyan-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full glass-panel hover:border-[#0221bf] dark:hover:border-cyan-400 transition-colors shadow-sm"
                >
                    Skip
                </button>
            </div>

            {/* Main Illustration Slide Card */}
            <div className="flex flex-col items-center text-center my-auto py-8">
                <div className={`w-48 h-48 rounded-full bg-gradient-to-b ${current.bgGradient} flex items-center justify-center text-7xl shadow-xl mb-8 border border-blue-400/40 dark:border-cyan-400/40 animate-scaleIn`}>
                    {current.icon}
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                    {current.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-cyan-200/80 max-w-xs leading-relaxed font-semibold">
                    {current.subtitle}
                </p>

                {/* Step Indicator Dots */}
                <div className="flex items-center gap-2 mt-8">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-[#0221bf] dark:bg-cyan-400 shadow-md' : 'w-2.5 bg-slate-300 dark:bg-slate-800 border border-slate-300 dark:border-cyan-500/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pb-4">
                <button
                    onClick={handleNext}
                    className="w-full py-4 bg-gradient-to-r from-[#0221bf] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 active:scale-[0.99] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all border border-cyan-300/30"
                >
                    <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
                    {currentSlide === slides.length - 1 ? <ArrowRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
            </div>

        </div>
    );
};
