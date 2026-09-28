export interface PlaceItem {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    category?: 'airport' | 'station' | 'shopping' | 'landmark' | 'business' | 'home' | 'work' | 'park' | 'general';
}

export interface RouteOption {
    id: string;
    name: string;
    summary: string;
    distanceMiles: number;
    durationMinutes: number;
    coordinates: [number, number][];
    isFastest?: boolean;
}

// Curated landmarks for instant high-quality local suggestions
const MOCK_LANDMARKS: PlaceItem[] = [
    {
        id: 'lm-1',
        name: "O'Hare International Airport (ORD)",
        address: '10000 W O\'Hare Ave, Chicago, IL 60666',
        lat: 41.9742,
        lng: -87.9073,
        category: 'airport'
    },
    {
        id: 'lm-2',
        name: 'Midway International Airport (MDW)',
        address: '5700 S Cicero Ave, Chicago, IL 60638',
        lat: 41.7868,
        lng: -87.7522,
        category: 'airport'
    },
    {
        id: 'lm-3',
        name: 'Millennium Park & Cloud Gate (The Bean)',
        address: '201 E Randolph St, Chicago, IL 60602',
        lat: 41.8826,
        lng: -87.6226,
        category: 'landmark'
    },
    {
        id: 'lm-4',
        name: 'Willis Tower Skydeck',
        address: '233 S Wacker Dr, Chicago, IL 60606',
        lat: 41.8789,
        lng: -87.6359,
        category: 'landmark'
    },
    {
        id: 'lm-5',
        name: 'Navy Pier Chicago',
        address: '600 E Grand Ave, Chicago, IL 60611',
        lat: 41.8917,
        lng: -87.6086,
        category: 'landmark'
    },
    {
        id: 'lm-6',
        name: 'Union Station Chicago',
        address: '225 S Canal St, Chicago, IL 60606',
        lat: 41.8787,
        lng: -87.6403,
        category: 'station'
    },
    {
        id: 'lm-7',
        name: 'Lincoln Park Zoo',
        address: '2001 N Clark St, Chicago, IL 60614',
        lat: 41.9213,
        lng: -87.6340,
        category: 'park'
    },
    {
        id: 'lm-8',
        name: 'Magnificent Mile Shopping',
        address: 'N Michigan Ave, Chicago, IL 60611',
        lat: 41.8948,
        lng: -87.6242,
        category: 'shopping'
    },
    {
        id: 'lm-9',
        name: 'Chicago Loop Financial Center',
        address: 'Financial Place, Chicago, IL 60605',
        lat: 41.8756,
        lng: -87.6322,
        category: 'business'
    },
    {
        id: 'lm-10',
        name: 'Wrigley Field Stadium',
        address: '1060 W Addison St, Chicago, IL 60654',
        lat: 41.9484,
        lng: -87.6553,
        category: 'landmark'
    }
];

// Helper to determine icon category from place text
const categorizePlace = (name: string, type: string = ''): PlaceItem['category'] => {
    const text = (name + ' ' + type).toLowerCase();
    if (text.includes('airport') || text.includes('terminal') || text.includes('aerodrome')) return 'airport';
    if (text.includes('station') || text.includes('metro') || text.includes('train') || text.includes('rail')) return 'station';
    if (text.includes('mall') || text.includes('market') || text.includes('shop') || text.includes('store')) return 'shopping';
    if (text.includes('park') || text.includes('garden') || text.includes('zoo')) return 'park';
    if (text.includes('tower') || text.includes('museum') || text.includes('pier') || text.includes('stadium')) return 'landmark';
    if (text.includes('center') || text.includes('plaza') || text.includes('office') || text.includes('hub')) return 'business';
    return 'general';
};

/**
 * Search places using Nominatim API + local landmarks fallback
 */
export const searchPlaces = async (query: string): Promise<PlaceItem[]> => {
    if (!query || query.trim().length === 0) return [];
    const normalized = query.toLowerCase().trim();

    const localMatches = MOCK_LANDMARKS.filter(
        p => p.name.toLowerCase().includes(normalized) || p.address.toLowerCase().includes(normalized)
    );

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        if (response.ok) {
            const data = await response.json();
            const remotePlaces: PlaceItem[] = data.map((item: any) => {
                const name = item.display_name.split(',')[0] || item.name || 'Selected Place';
                const parts = item.display_name.split(',');
                const address = parts.length > 1 ? parts.slice(1).join(',').trim() : item.display_name;
                return {
                    id: `nom-${item.place_id}`,
                    name,
                    address,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon),
                    category: categorizePlace(name, item.type)
                };
            });

            // Combine remote & local, filtering duplicates
            const combined = [...remotePlaces];
            localMatches.forEach(lm => {
                if (!combined.some(c => Math.abs(c.lat - lm.lat) < 0.005 && Math.abs(c.lng - lm.lng) < 0.005)) {
                    combined.push(lm);
                }
            });
            return combined.slice(0, 8);
        }
    } catch (err) {
        console.warn('Places API fetch failed, using local landmarks:', err);
    }

    return localMatches.length > 0
        ? localMatches
        : [
            {
                id: 'search-fallback-1',
                name: query,
                address: `${query}, City Center`,
                lat: 41.8781 + (Math.random() - 0.5) * 0.04,
                lng: -87.6298 + (Math.random() - 0.5) * 0.04,
                category: 'general'
            }
        ];
};

/**
 * Reverse geocode coordinates to human-readable address string
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'Accept-Language': 'en' } }
        );
        if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
                const parts = data.display_name.split(',');
                const mainName = parts[0] ? parts[0].trim() : '';
                const subAddress = parts.slice(1, 4).join(',').trim();
                return mainName && subAddress ? `${mainName}, ${subAddress}` : data.display_name;
            }
        }
    } catch (err) {
        console.warn('Reverse geocode error:', err);
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

/**
 * Calculate distance in miles between two coordinates (Haversine formula)
 */
export const calculateDistanceMiles = (start: [number, number], end: [number, number]): number => {
    const [lat1, lon1] = start;
    const [lat2, lon2] = end;
    const R = 3958.8; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return Math.round(dist * 10) / 10 || 1.2;
};

/**
 * Generate fallback interpolated road polyline points between start and end
 */
const generateFallbackRoutePoints = (
    start: [number, number],
    end: [number, number],
    offsetFactor: number = 0
): [number, number][] => {
    const points: [number, number][] = [];
    const steps = 12;
    const [lat1, lng1] = start;
    const [lat2, lng2] = end;

    const midLat = (lat1 + lat2) / 2 + offsetFactor * 0.008;
    const midLng = (lng1 + lng2) / 2 + offsetFactor * 0.008;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Quadratic Bezier curve to simulate realistic road curved path
        const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
        const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2;
        points.push([lat, lng]);
    }
    return points;
};

/**
 * Fetch OSRM driving route between pickup and destination coordinates
 */
export const fetchRouteOptions = async (
    start: [number, number],
    end: [number, number]
): Promise<RouteOption[]> => {
    const directDistance = calculateDistanceMiles(start, end);
    const estDurationMinutes = Math.max(5, Math.round(directDistance * 2.1 + 4));

    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&alternatives=true`;
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                return data.routes.map((r: any, idx: number) => {
                    const coords: [number, number][] = r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
                    const miles = Math.round((r.distance / 1609.34) * 10) / 10;
                    const mins = Math.max(3, Math.round(r.duration / 60));

                    const names = ['Fastest Route', 'Expressway Route', 'Alternative Scenic Route'];
                    const summaries = ['Via Main Highway / Expressway', 'Via City Arterial Roads', 'Via Scenic Lakeshore Drive'];

                    return {
                        id: `route-osrm-${idx}`,
                        name: names[idx] || `Route Option ${idx + 1}`,
                        summary: summaries[idx] || 'Recommended drive route',
                        distanceMiles: miles,
                        durationMinutes: mins,
                        coordinates: coords,
                        isFastest: idx === 0
                    };
                });
            }
        }
    } catch (err) {
        console.warn('OSRM routing failed, building smart fallback polyline:', err);
    }

    // Fallback route options if offline or network fail
    const route1Points = generateFallbackRoutePoints(start, end, 0);
    const route2Points = generateFallbackRoutePoints(start, end, 1.2);

    return [
        {
            id: 'route-opt-1',
            name: 'Fastest Route',
            summary: 'Via Expressway & Main Arterials',
            distanceMiles: directDistance,
            durationMinutes: estDurationMinutes,
            coordinates: route1Points,
            isFastest: true
        },
        {
            id: 'route-opt-2',
            name: 'Alternative Route',
            summary: 'Via Lakeshore & City Boulevards',
            distanceMiles: Math.round((directDistance + 1.4) * 10) / 10,
            durationMinutes: estDurationMinutes + 5,
            coordinates: route2Points,
            isFastest: false
        }
    ];
};
