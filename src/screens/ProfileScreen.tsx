import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Bell, CheckCircle, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';
import { MOCK_NOTIFICATIONS } from '../constants/mockData';

export const ProfileScreen: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const { goBack } = useRide();

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile({ firstName, lastName, email, phone });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="User Profile" showBack={true} />

            <form onSubmit={handleSave} className="my-auto space-y-4 max-w-md mx-auto w-full pt-2">

                {/* Avatar with Halo Ring */}
                <div className="flex flex-col items-center mb-3">
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-cyan-400/60 shadow-[0_0_30px_#00f0ff]"
                        />
                        <button
                            type="button"
                            className="absolute -bottom-1 -right-1 p-2 rounded-2xl bg-gradient-to-tr from-[#0129d1] to-cyan-400 text-white shadow-lg border border-cyan-300/40 hover:scale-110 transition-transform active:scale-95"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <h2 className="text-lg font-black mt-3 text-white flex items-center gap-1.5">
                        {firstName} {lastName} <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h2>
                    <p className="text-xs text-cyan-200/70 font-semibold">{email}</p>
                </div>

                {saved && (
                    <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
                        <CheckCircle className="w-4 h-4" />
                        Profile updated successfully!
                    </div>
                )}

                <div className="p-5 rounded-3xl glass-card border border-cyan-400/30 space-y-3.5 shadow-2xl">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-cyan-400 tracking-wider mb-1">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-cyan-400 tracking-wider mb-1">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-cyan-400 tracking-wider mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-cyan-400 tracking-wider mb-1">Phone Number</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-2xl glass-input text-xs font-bold focus:outline-none text-white"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#0129d1] via-blue-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/30 transition-all border border-cyan-300/30 flex items-center justify-center gap-2 active:scale-98"
                >
                    <Save className="w-5 h-5" />
                    <span>Save Profile Changes</span>
                </button>

            </form>
        </div>
    );
};

export const NotificationsScreen: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen cyber-bg-dark p-5 text-white transition-colors duration-200 select-none">
            <Sidebar />
            <Header title="Notifications" showBack={true} />

            <div className="my-auto space-y-3 max-w-md mx-auto w-full pt-3">
                {MOCK_NOTIFICATIONS.map((n) => (
                    <div
                        key={n.id}
                        className="p-4 rounded-3xl glass-card border border-cyan-400/20 space-y-1 hover:border-cyan-400 transition-all shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-xs text-white flex items-center gap-2">
                                <Bell className="w-4 h-4 text-cyan-400" />
                                {n.title}
                            </h3>
                            <span className="text-[10px] text-gray-400 font-bold">{n.time}</span>
                        </div>
                        <p className="text-xs text-cyan-200/80 pl-6 leading-relaxed">
                            {n.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
