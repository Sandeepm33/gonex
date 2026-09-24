import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
}

interface AuthContextType {
    user: UserProfile;
    isAuthenticated: boolean;
    login: (emailOrPhone: string, pass: string) => boolean;
    register: (profile: Partial<UserProfile>) => void;
    logout: () => void;
    updateProfile: (updated: Partial<UserProfile>) => void;
}

const DEFAULT_USER: UserProfile = {
    firstName: 'Sandeep',
    lastName: 'Bhargav',
    email: 'sandeep@email.com',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

    const login = (emailOrPhone: string, _pass: string) => {
        setIsAuthenticated(true);
        if (emailOrPhone) {
            setUser(prev => ({ ...prev, email: emailOrPhone.includes('@') ? emailOrPhone : prev.email }));
        }
        return true;
    };

    const register = (profile: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...profile }));
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const updateProfile = (updated: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...updated }));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
