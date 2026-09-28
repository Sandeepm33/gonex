import React, { createContext, useContext, useState, useEffect } from 'react';
import { RIDE_TYPES, RideType } from '../constants/rides';
import {
    MOCK_DRIVER,
    MOCK_RIDE_HISTORY,
    MOCK_SCHEDULED_RIDES,
    MOCK_PAYMENTS,
    Driver,
    RideHistoryItem,
    ScheduledRideItem,
    PaymentMethod
} from '../constants/mockData';
import {
    RouteOption,
    reverseGeocode,
    fetchRouteOptions,
    calculateDistanceMiles
} from '../services/locationService';

export type DriverType = Driver;
export type { Driver, ScheduledRideItem };

export type MapStyleType = 'roadmap' | 'satellite' | 'hybrid' | 'cyber';
export type BookingType = 'now' | 'later';

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

    pickupCoords: [number, number];
    destinationCoords: [number, number];
    setPickupCoords: (coords: [number, number]) => void;
    setDestinationCoords: (coords: [number, number]) => void;

    distanceMiles: number;
    setDistanceMiles: (val: number) => void;
    estimatedMinutes: number;
    setEstimatedMinutes: (val: number) => void;

    routeOptions: RouteOption[];
    setRouteOptions: (options: RouteOption[]) => void;
    selectedRouteIndex: number;
    setSelectedRouteIndex: (idx: number) => void;

    swapLocations: () => void;
    isLocatingUser: boolean;
    useCurrentLocation: () => Promise<void>;
    selectPickupLocation: (address: string, coords: [number, number]) => void;
    selectDestinationLocation: (address: string, coords: [number, number]) => void;

    activeMapSelectionMode: 'pickup' | 'destination' | null;
    setActiveMapSelectionMode: (mode: 'pickup' | 'destination' | null) => void;

    // Map controls & Maximize/Minimize state
    isMapMaximized: boolean;
    setIsMapMaximized: (val: boolean) => void;
    toggleMapMaximize: () => void;
    mapCenter: [number, number]; // [lat, lng]
    setMapCenter: (coords: [number, number]) => void;
    mapZoom: number;
    setMapZoom: (zoom: number) => void;
    mapStyle: MapStyleType;
    setMapStyle: (style: MapStyleType) => void;

    // Booking Mode & Scheduled Rides ("Book a ride for later")
    bookingType: BookingType;
    setBookingType: (type: BookingType) => void;
    scheduledDate: string;
    setScheduledDate: (date: string) => void;
    scheduledTime: string;
    setScheduledTime: (time: string) => void;
    scheduledRides: ScheduledRideItem[];
    scheduleRideBooking: (customDetails?: Partial<ScheduledRideItem>) => void;
    cancelScheduledRide: (id: string) => void;

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
    confirmLocations: (p: string, d: string, pCoords?: [number, number], dCoords?: [number, number]) => void;
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

    // Default Chicago coordinates
    const [pickupCoords, setPickupCoords] = useState<[number, number]>([41.8781, -87.6298]);
    const [destinationCoords, setDestinationCoords] = useState<[number, number]>([41.9742, -87.9073]); // O'Hare Airport

    const [pickup, setPickup] = useState<string>('123 Main Street, Chicago');
    const [destination, setDestination] = useState<string>("O'Hare International Airport (ORD)");
    const [distanceMiles, setDistanceMiles] = useState<number>(18.4);
    const [estimatedMinutes, setEstimatedMinutes] = useState<number>(32);

    const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndexState] = useState<number>(0);
    const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
    const [activeMapSelectionMode, setActiveMapSelectionMode] = useState<'pickup' | 'destination' | null>(null);

    // Map controls & Maximize state
    const [isMapMaximized, setIsMapMaximized] = useState<boolean>(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([41.8781, -87.6298]);
    const [mapZoom, setMapZoom] = useState<number>(13);
    const [mapStyle, setMapStyle] = useState<MapStyleType>('roadmap');

    // Book for later state
    const [bookingType, setBookingType] = useState<BookingType>('now');
    const [scheduledDate, setScheduledDate] = useState<string>(
        new Date(Date.now() + 86400000).toISOString().split('T')[0]
    );
    const [scheduledTime, setScheduledTime] = useState<string>('10:30 AM');
    const [scheduledRides, setScheduledRides] = useState<ScheduledRideItem[]>(MOCK_SCHEDULED_RIDES);

    const [selectedRideId, setSelectedRideIdState] = useState<string>('standard-x');
    const [fareSheetRideId, setFareSheetRideId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(3);

    const [driver] = useState<Driver>(MOCK_DRIVER);
    const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>(MOCK_RIDE_HISTORY);
    const [paymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENTS);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(MOCK_PAYMENTS[0]);

    const selectedRide = RIDE_TYPES.find(r => r.id === selectedRideId) || RIDE_TYPES[0];

    // Recompute OSRM route options whenever pickupCoords or destinationCoords change
    useEffect(() => {
        let isMounted = true;
        fetchRouteOptions(pickupCoords, destinationCoords).then(routes => {
            if (isMounted && routes.length > 0) {
                setRouteOptions(routes);
                setSelectedRouteIndexState(0);
                setDistanceMiles(routes[0].distanceMiles);
                setEstimatedMinutes(routes[0].durationMinutes);
            }
        });
        return () => { isMounted = false; };
    }, [pickupCoords, destinationCoords]);

    const setSelectedRouteIndex = (idx: number) => {
        setSelectedRouteIndexState(idx);
        if (routeOptions[idx]) {
            setDistanceMiles(routeOptions[idx].distanceMiles);
            setEstimatedMinutes(routeOptions[idx].durationMinutes);
        }
    };

    const swapLocations = () => {
        const tempPickup = pickup;
        const tempPickupCoords = pickupCoords;

        setPickup(destination);
        setPickupCoords(destinationCoords);

        setDestination(tempPickup);
        setDestinationCoords(tempPickupCoords);
        setMapCenter(destinationCoords);
    };

    const useCurrentLocation = async () => {
        setIsLocatingUser(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setPickupCoords(coords);
                    setMapCenter(coords);
                    setMapZoom(16);
                    const address = await reverseGeocode(coords[0], coords[1]);
                    setPickup(address || 'Current Location');
                    setIsLocatingUser(false);
                },
                (err) => {
                    console.warn('Geolocation error:', err);
                    setIsLocatingUser(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setIsLocatingUser(false);
        }
    };

    const selectPickupLocation = (address: string, coords: [number, number]) => {
        setPickup(address);
        setPickupCoords(coords);
        setMapCenter(coords);
    };

    const selectDestinationLocation = (address: string, coords: [number, number]) => {
        setDestination(address);
        setDestinationCoords(coords);
        setMapCenter(coords);
    };

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

    const toggleMapMaximize = () => {
        setIsMapMaximized(prev => !prev);
    };

    const setSelectedRideId = (id: string) => {
        setSelectedRideIdState(id);
    };

    const confirmLocations = (
        p: string,
        d: string,
        pCoords?: [number, number],
        dCoords?: [number, number]
    ) => {
        setPickup(p);
        setDestination(d);
        if (pCoords) setPickupCoords(pCoords);
        if (dCoords) setDestinationCoords(dCoords);

        const currentPCoords = pCoords || pickupCoords;
        const currentDCoords = dCoords || destinationCoords;
        const dist = calculateDistanceMiles(currentPCoords, currentDCoords);
        setDistanceMiles(dist);
        setEstimatedMinutes(Math.max(5, Math.round(dist * 2.1 + 4)));
        navigate('route-preview');
    };

    const scheduleRideBooking = (customDetails?: Partial<ScheduledRideItem>) => {
        const newScheduledItem: ScheduledRideItem = {
            id: `sr-${Date.now()}`,
            type: selectedRide.name,
            pickup: pickup || '123 Main Street',
            destination: destination || 'Downtown Chicago',
            scheduledDate: scheduledDate,
            scheduledTime: scheduledTime,
            estimatedFare: selectedRide.id === 'standard-x' ? 48.50 : 62.00,
            status: 'Scheduled',
            ...customDetails
        };
        setScheduledRides(prev => [newScheduledItem, ...prev]);
        navigate('my-rides');
    };

    const cancelScheduledRide = (id: string) => {
        setScheduledRides(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
    };

    const confirmRideBooking = () => {
        if (bookingType === 'later') {
            scheduleRideBooking();
        } else {
            navigate('searching-driver');
        }
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
                pickupCoords,
                destinationCoords,
                setPickupCoords,
                setDestinationCoords,
                distanceMiles,
                setDistanceMiles,
                estimatedMinutes,
                setEstimatedMinutes,
                routeOptions,
                setRouteOptions,
                selectedRouteIndex,
                setSelectedRouteIndex,
                swapLocations,
                isLocatingUser,
                useCurrentLocation,
                selectPickupLocation,
                selectDestinationLocation,
                activeMapSelectionMode,
                setActiveMapSelectionMode,
                isMapMaximized,
                setIsMapMaximized,
                toggleMapMaximize,
                mapCenter,
                setMapCenter,
                mapZoom,
                setMapZoom,
                mapStyle,
                setMapStyle,
                bookingType,
                setBookingType,
                scheduledDate,
                setScheduledDate,
                scheduledTime,
                setScheduledTime,
                scheduledRides,
                scheduleRideBooking,
                cancelScheduledRide,
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

