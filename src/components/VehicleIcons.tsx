import React from 'react';

export const StandardXCarSVG: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="sedanBody" x1="0" y1="0" x2="160" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="sedanGlass" x1="40" y1="20" x2="110" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0221bf" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="wheelRim" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="glowLight" x="120" y="30" width="40" height="30" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="3" result="blur" />
            </filter>
        </defs>

        {/* Soft Drop Shadow */}
        <ellipse cx="80" cy="74" rx="68" ry="8" fill="#000" fillOpacity="0.25" />

        {/* Car Main Metallic Body */}
        <path
            d="M15 52 C 15 48, 25 42, 38 40 L 52 25 C 58 18, 75 16, 102 18 L 122 34 C 138 36, 150 42, 152 48 L 152 58 C 152 62, 148 64, 142 64 L 18 64 C 14 64, 15 58, 15 52 Z"
            fill="url(#sedanBody)"
            stroke="#64748b"
            strokeWidth="1.5"
        />

        {/* Windows / Cabin Glass */}
        <path
            d="M54 26 C 60 20, 75 19, 98 20 L 116 34 L 50 34 Z"
            fill="url(#sedanGlass)"
            stroke="#0284c7"
            strokeWidth="1"
        />
        {/* Center Door B-Pillar */}
        <line x1="82" y1="20" x2="82" y2="34" stroke="#1e293b" strokeWidth="2.5" />

        {/* Headlight LED Glow */}
        <ellipse cx="146" cy="46" rx="5" ry="3" fill="#38bdf8" />
        <polygon points="148,44 160,38 160,54 148,48" fill="#38bdf8" fillOpacity="0.3" filter="url(#glowLight)" />

        {/* Taillight LED */}
        <path d="M 16 46 C 16 44, 20 44, 22 46 L 20 50 L 16 49 Z" fill="#ef4444" />

        {/* Front Wheel */}
        <g transform="translate(112, 52)">
            <circle cx="12" cy="12" r="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="12" cy="12" r="8" fill="url(#wheelRim)" />
            <circle cx="12" cy="12" r="3" fill="#f8fafc" />
        </g>

        {/* Rear Wheel */}
        <g transform="translate(26, 52)">
            <circle cx="12" cy="12" r="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="12" cy="12" r="8" fill="url(#wheelRim)" />
            <circle cx="12" cy="12" r="3" fill="#f8fafc" />
        </g>

        {/* Door Handle & Character Lines */}
        <line x1="60" y1="42" x2="105" y2="42" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="68" y="40" width="8" height="2" rx="1" fill="#475569" />
        <rect x="94" y="40" width="8" height="2" rx="1" fill="#475569" />
    </svg>
);

export const StandardXlSuvSVG: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="suvBody" x1="0" y1="0" x2="160" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="suvGlass" x1="30" y1="15" x2="120" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="suvWheelRim" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
        </defs>

        {/* Soft Drop Shadow */}
        <ellipse cx="80" cy="76" rx="72" ry="9" fill="#000" fillOpacity="0.3" />

        {/* SUV Roof Rack Bars */}
        <rect x="45" y="12" width="65" height="3" rx="1.5" fill="#64748b" />
        <rect x="52" y="15" width="4" height="4" fill="#334155" />
        <rect x="100" y="15" width="4" height="4" fill="#334155" />

        {/* SUV High-Profile Metallic Body */}
        <path
            d="M12 50 C 12 44, 20 36, 32 34 L 42 16 C 46 14, 105 14, 115 16 L 132 34 C 146 36, 154 42, 154 50 L 154 60 C 154 65, 148 66, 140 66 L 20 66 C 14 66, 12 62, 12 50 Z"
            fill="url(#suvBody)"
            stroke="#1d4ed8"
            strokeWidth="1.5"
        />

        {/* SUV Large Windows Cabin */}
        <path
            d="M44 19 C 48 17, 104 17, 112 19 L 126 34 L 38 34 Z"
            fill="url(#suvGlass)"
            stroke="#10b981"
            strokeWidth="1"
        />
        {/* Door Pillars */}
        <line x1="68" y1="18" x2="68" y2="34" stroke="#0f172a" strokeWidth="2.5" />
        <line x1="94" y1="18" x2="94" y2="34" stroke="#0f172a" strokeWidth="2.5" />

        {/* Bright LED Headlights */}
        <ellipse cx="148" cy="44" rx="5" ry="4" fill="#67e8f9" />
        <path d="M 148 40 L 158 36 L 158 52 L 148 48 Z" fill="#67e8f9" fillOpacity="0.35" />

        {/* LED Taillight */}
        <path d="M 14 42 C 14 40, 18 40, 20 42 L 18 48 L 14 47 Z" fill="#ef4444" />

        {/* Large SUV Wheels */}
        <g transform="translate(110, 48)">
            <circle cx="14" cy="14" r="16" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
            <circle cx="14" cy="14" r="9" fill="url(#suvWheelRim)" />
            <circle cx="14" cy="14" r="3.5" fill="#f8fafc" />
        </g>

        <g transform="translate(24, 48)">
            <circle cx="14" cy="14" r="16" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
            <circle cx="14" cy="14" r="9" fill="url(#suvWheelRim)" />
            <circle cx="14" cy="14" r="3.5" fill="#f8fafc" />
        </g>

        {/* Chrome Accent Handles */}
        <line x1="48" y1="42" x2="108" y2="42" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="56" y="39" width="9" height="2.5" rx="1" fill="#e2e8f0" />
        <rect x="84" y="39" width="9" height="2.5" rx="1" fill="#e2e8f0" />
    </svg>
);
