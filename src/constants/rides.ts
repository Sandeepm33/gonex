import standardXImg from '../assets/standard_x.png';
import standardXlImg from '../assets/standard_xl.png';

export interface RideType {
    id: string;
    name: string;
    description: string;
    capacity: number;
    baseFare: number;
    minimumFare: number;
    perMile: number;
    perMinuteWait: number;
    eta: string;
    image: string;
    badge?: string;
}

export const RIDE_TYPES: RideType[] = [
    {
        id: "standard-x",
        name: "Standard X",
        description: "Affordable, quick everyday rides",
        capacity: 4,
        baseFare: 5.00,
        minimumFare: 10.00,
        perMile: 2.35,
        perMinuteWait: 0.25,
        eta: "3 min away",
        image: "https://www.volvocars.com/images/cs/v3/assets/blt84e01a6904dbd2e8/blt24bfb4afc201ca69/6a4bb32c061d8c76329634a7/xc60-phev-carousel-4x3.png?branch=prod_alias&quality=85&format=auto&iar=0&w=3840",
        badge: "POPULAR"
    },
    {
        id: "standard-xl",
        name: "Standard XL",
        description: "Spacious SUVs for groups & extra luggage",
        capacity: 7,
        baseFare: 10.00,
        minimumFare: 15.00,
        perMile: 3.20,
        perMinuteWait: 0.40,
        eta: "5 min away",
        image: standardXlImg,
        badge: "GROUP CHOICE"
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
