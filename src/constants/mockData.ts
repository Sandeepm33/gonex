export interface SavedPlace {
    id: string;
    name: string;
    address: string;
    icon: string;
}

export interface Driver {
    id: string;
    name: string;
    rating: number;
    trips: number;
    phone: string;
    vehicle: string;
    color: string;
    plate: string;
    avatar: string;
    vehicleModel?: string;
    vehicleColor?: string;
    licensePlate?: string;
}


export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'driver' | 'completed' | 'payment' | 'promo';
}

export interface RideHistoryItem {
    id: string;
    type: 'Standard X' | 'Standard XL';
    pickup: string;
    destination: string;
    date: string;
    amount: number;
    status: 'Completed' | 'Cancelled';
    rating?: number;
}

export interface ScheduledRideItem {
    id: string;
    type: string;
    pickup: string;
    destination: string;
    scheduledDate: string;
    scheduledTime: string;
    estimatedFare: number;
    status: 'Scheduled' | 'Cancelled';
}

export interface PaymentMethod {
    id: string;
    type: 'Visa' | 'Mastercard' | 'ApplePay' | 'Cash';
    last4?: string;
    isDefault: boolean;
    expiry?: string;
}

export const MOCK_SAVED_PLACES: SavedPlace[] = [
    { id: '1', name: 'Home', address: '742 Evergreen Terrace, Chicago', icon: '🏠' },
    { id: '2', name: 'Work', address: '100 Willis Tower, Chicago Downtown', icon: '💼' },
    { id: '3', name: 'Chicago O\'Hare Airport', address: '10000 W O\'Hare Ave, Chicago', icon: '✈️' },
    { id: '4', name: 'Millennium Park', address: '201 E Randolph St, Chicago', icon: '🌳' },
];

export const MOCK_DRIVER: Driver = {
    id: 'd1',
    name: 'John Davenport',
    rating: 4.9,
    trips: 1420,
    phone: '+1 (555) 234-5678',
    vehicle: 'Toyota Camry Hybrid',
    color: 'Midnight Black',
    plate: 'ABC 1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

export const MOCK_DRIVERS: Driver[] = [
    MOCK_DRIVER,
    {
        id: 'd2',
        name: 'Sarah Connor',
        rating: 4.95,
        trips: 2100,
        phone: '+1 (555) 987-6543',
        vehicle: 'Tesla Model 3',
        color: 'Pearl White',
        plate: 'XYZ 9876',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    },
    {
        id: 'd3',
        name: 'Marcus Vance',
        rating: 4.88,
        trips: 890,
        phone: '+1 (555) 345-6789',
        vehicle: 'Honda Accord',
        color: 'Silver Metallic',
        plate: 'NEX 5544',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    }
];

export const MOCK_RIDE_HISTORY: RideHistoryItem[] = [
    {
        id: 'r1',
        type: 'Standard X',
        pickup: '123 Main Street, Chicago',
        destination: 'Downtown Chicago',
        date: 'Sep 24, 2026',
        amount: 67.47,
        status: 'Completed',
        rating: 5,
    },
    {
        id: 'r2',
        type: 'Standard XL',
        pickup: 'O\'Hare International Airport',
        destination: 'North Michigan Ave',
        date: 'Sep 20, 2026',
        amount: 74.20,
        status: 'Completed',
        rating: 5,
    },
    {
        id: 'r3',
        type: 'Standard X',
        pickup: 'Navy Pier',
        destination: 'Lincoln Park Zoo',
        date: 'Sep 15, 2026',
        amount: 24.50,
        status: 'Completed',
        rating: 4,
    }
];

export const MOCK_SCHEDULED_RIDES: ScheduledRideItem[] = [
    {
        id: 'sr-1',
        type: 'Standard X',
        pickup: '123 Main Street, Chicago',
        destination: 'Chicago O\'Hare International Airport',
        scheduledDate: '2026-09-26',
        scheduledTime: '06:30 AM',
        estimatedFare: 52.40,
        status: 'Scheduled'
    },
    {
        id: 'sr-2',
        type: 'Standard XL',
        pickup: 'Work, Willis Tower',
        destination: 'Union Station, Chicago',
        scheduledDate: '2026-09-28',
        scheduledTime: '05:15 PM',
        estimatedFare: 28.90,
        status: 'Scheduled'
    }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'n1',
        title: 'Driver Assigned',
        message: 'John Davenport is on the way in a Toyota Camry (ABC 1234). ETA 4 min.',
        time: '5 min ago',
        read: false,
        type: 'driver'
    },
    {
        id: 'n2',
        title: 'Ride Completed',
        message: 'Your trip to Downtown Chicago has ended. Total charged: $67.47.',
        time: '2 hours ago',
        read: true,
        type: 'completed'
    },
    {
        id: 'n3',
        title: 'Payment Successful',
        message: 'Payment of $67.47 via Visa ending in 4242 was successful.',
        time: 'Yesterday',
        read: true,
        type: 'payment'
    }
];

export const MOCK_PAYMENTS: PaymentMethod[] = [
    { id: 'p1', type: 'Visa', last4: '4242', isDefault: true, expiry: '12/28' },
    { id: 'p2', type: 'Mastercard', last4: '8899', isDefault: false, expiry: '09/27' },
    { id: 'p3', type: 'ApplePay', isDefault: false },
    { id: 'p4', type: 'Cash', isDefault: false },
];
