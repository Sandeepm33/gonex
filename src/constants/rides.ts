export interface RideType {
    id: string;
    name: string;
    description: string;
    capacity: number;
    baseFare: number;
    minimumFare: number;
    perMile: number; // Changed from perDistance to perMile as requested by user
    perMinuteWait: number;
    eta: string;
    image: string;
}

export const RIDE_TYPES: RideType[] = [
    {
        id: "standard-x",
        name: "Standard X",
        description: "Get Standard X Rides",
        capacity: 4,
        baseFare: 5.00,
        minimumFare: 10.00,
        perMile: 2.35,
        perMinuteWait: 0.00,
        eta: "4 min away",
        image: "🚗"
    },
    {
        id: "standard-xl",
        name: "Standard XL",
        description: "Get Standard XL Rides",
        capacity: 7,
        baseFare: 10.00,
        minimumFare: 10.00,
        perMile: 2.50,
        perMinuteWait: 1.25,
        eta: "6 min away",
        image: "🚙"
    }
];

export const calculateFare = (
    ride: RideType,
    distanceMiles: number,
    waitingMinutes: number = 0
): {
    baseFare: number;
    distanceFare: number;
    waitingFare: number;
    calculatedFare: number;
    finalFare: number;
} => {
    const distanceFare = Number((distanceMiles * ride.perMile).toFixed(2));
    const waitingFare = Number((waitingMinutes * ride.perMinuteWait).toFixed(2));
    const calculatedFare = Number((ride.baseFare + distanceFare + waitingFare).toFixed(2));
    const finalFare = Math.max(calculatedFare, ride.minimumFare);

    return {
        baseFare: ride.baseFare,
        distanceFare,
        waitingFare,
        calculatedFare,
        finalFare: Number(finalFare.toFixed(2))
    };
};
