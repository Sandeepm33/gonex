import React, { createContext, useContext, useState } from 'react';
import { RIDE_TYPES, RideType } from '../constants/rides';
import { MOCK_DRIVER, MOCK_RIDE_HISTORY, MOCK_PAYMENTS, Driver, RideHistoryItem, PaymentMethod } from '../constants/mockData';

export type DriverType = Driver;
export type { Driver };


export type ScreenType =
    | 'splash'
    | 'onboarding'
    | 'login'
    | 'register'
    | 'forgot-password'
    | 'otp'
    | 'home'
    | 'location-search'
    | 'route-preview'
    | 'ride-selection'
    | 'confirm-ride'
    | 'searching-driver'
    | 'driver-found'
    | 'active-ride'
    | 'ride-completed'
    | 'my-rides'
    | 'ride-history'
    | 'payment-methods'
    | 'notifications'
    | 'profile'
    | 'settings'
    | 'help'
    | 'terms';

interface RideContextType {
    currentScreen: ScreenType;
    navigate: (screen: ScreenType) => void;
    goBack: () => void;
    screenHistory: ScreenType[];

    pickup: string;
    destination: string;
    setPickup: (val: string) => void;
    setDestination: (val: string) => void;
    distanceMiles: number;
    setDistanceMiles: (val: number) => void;
    estimatedMinutes: number;

    selectedRide: RideType;
    setSelectedRideId: (id: string) => void;
    fareSheetRideId: string | null;
    setFareSheetRideId: (id: string | null) => void;

    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    unreadNotificationsCount: number;
    setUnreadNotificationsCount: (count: number) => void;

    driver: Driver;
    rideHistory: RideHistoryItem[];
    paymentMethods: PaymentMethod[];
    selectedPayment: PaymentMethod;
    setSelectedPayment: (p: PaymentMethod) => void;

    // Booking lifecycle helpers
    confirmLocations: (p: string, d: string) => void;
    confirmRideBooking: () => void;
    cancelRide: () => void;
    completeRide: () => void;
    submitRating: (stars: number) => void;
    resetToHome: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['home']);
    const currentScreen = screenHistory[screenHistory.length - 1] || 'home';

    const [pickup, setPickup] = useState<string>('123 Main Street, Chicago');
    const [destination, setDestination] = useState<string>('Downtown Chicago');
    const [distanceMiles, setDistanceMiles] = useState<number>(18.4);
    const [estimatedMinutes] = useState<number>(32);

    const [selectedRideId, setSelectedRideIdState] = useState<string>('standard-x');
    const [fareSheetRideId, setFareSheetRideId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(3);

    const [driver] = useState<Driver>(MOCK_DRIVER);
    const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>(MOCK_RIDE_HISTORY);
    const [paymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENTS);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(MOCK_PAYMENTS[0]);

    const selectedRide = RIDE_TYPES.find(r => r.id === selectedRideId) || RIDE_TYPES[0];

    const navigate = (screen: ScreenType) => {
        setScreenHistory(prev => [...prev, screen]);
        setSidebarOpen(false);
    };

    const goBack = () => {
        setScreenHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    };

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const setSelectedRideId = (id: string) => {
        setSelectedRideIdState(id);
    };

    const confirmLocations = (p: string, d: string) => {
        setPickup(p);
        setDestination(d);
        // Simulate distance
        setDistanceMiles(18.4);
        navigate('route-preview');
    };

    const confirmRideBooking = () => {
        navigate('searching-driver');
    };

    const cancelRide = () => {
        navigate('home');
    };

    const completeRide = () => {
        navigate('ride-completed');
    };

    const submitRating = (stars: number) => {
        const newRide: RideHistoryItem = {
            id: `r-${Date.now()}`,
            type: selectedRide.name as 'Standard X' | 'Standard XL',
            pickup,
            destination,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: selectedRide.id === 'standard-x' ? 67.47 : 74.20,
            status: 'Completed',
            rating: stars
        };
        setRideHistory(prev => [newRide, ...prev]);
        navigate('home');
    };

    const resetToHome = () => {
        setScreenHistory(['home']);
        setSidebarOpen(false);
    };

    return (
        <RideContext.Provider
            value={{
                currentScreen,
                navigate,
                goBack,
                screenHistory,
                pickup,
                destination,
                setPickup,
                setDestination,
                distanceMiles,
                setDistanceMiles,
                estimatedMinutes,
                selectedRide,
                setSelectedRideId,
                fareSheetRideId,
                setFareSheetRideId,
                sidebarOpen,
                setSidebarOpen,
                toggleSidebar,
                unreadNotificationsCount,
                setUnreadNotificationsCount,
                driver,
                rideHistory,
                paymentMethods,
                selectedPayment,
                setSelectedPayment,
                confirmLocations,
                confirmRideBooking,
                cancelRide,
                completeRide,
                submitRating,
                resetToHome,
            }}
        >
            {children}
        </RideContext.Provider>
    );
};

export const useRide = () => {
    const context = useContext(RideContext);
    if (!context) {
        throw new Error('useRide must be used within a RideProvider');
    }
    return context;
};
