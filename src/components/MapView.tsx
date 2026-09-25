import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
    Maximize2,
    Minimize2,
    Plus,
    Minus,
    Layers,
    Search,
    MapPin,
    Navigation,
    LocateFixed,
    Check,
    X,
    Calendar,
    Clock,
    Moon
} from 'lucide-react';
import { useRide, MapStyleType } from '../context/RideContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_DRIVERS } from '../constants/mockData';

interface MapViewProps {
    showRoute?: boolean;
    showDriver?: boolean;
    isSearching?: boolean;
    interactive?: boolean;
}

// Nominatim places search helper
export const searchPlaces = async (query: string) => {
    if (!query.trim()) return [];
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
            { headers: { 'Accept-Language': 'en' } }
        );
        if (response.ok) {
            const data = await response.json();
            return data.map((item: any) => ({
                id: item.place_id.toString(),
                name: item.display_name.split(',')[0],
                address: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
            }));
        }
    } catch (err) {
        console.warn('Geocoding error, falling back to mock results:', err);
    }
    // Fallback mock search places
    const fallbackList = [
        { id: 'f1', name: 'O\'Hare International Airport', address: '10000 W O\'Hare Ave, Chicago, IL', lat: 41.9742, lng: -87.9073 },
        { id: 'f2', name: 'Millennium Park & Cloud Gate', address: '201 E Randolph St, Chicago, IL', lat: 41.8826, lng: -87.6226 },
        { id: 'f3', name: 'Willis Tower Skydeck', address: '233 S Wacker Dr, Chicago, IL', lat: 41.8789, lng: -87.6359 },
        { id: 'f4', name: 'Navy Pier Chicago', address: '600 E Grand Ave, Chicago, IL', lat: 41.8917, lng: -87.6086 },
        { id: 'f5', name: 'Lincoln Park Zoo', address: '2001 N Clark St, Chicago, IL', lat: 41.9213, lng: -87.6340 },
        { id: 'f6', name: 'Union Station Chicago', address: '225 S Canal St, Chicago, IL', lat: 41.8787, lng: -87.6403 }
    ];
    return fallbackList.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase())
    );
};

export const MapView: React.FC<MapViewProps> = ({
    showRoute = true,
    showDriver = false,
    isSearching = false,
    interactive = true
}) => {
    const {
        pickup,
        destination,
        confirmLocations,
        isMapMaximized,
        toggleMapMaximize,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        mapStyle,
        setMapStyle
    } = useRide();

    const { isDark } = useTheme();

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const markersGroupRef = useRef<L.LayerGroup | null>(null);

    const [showLayerMenu, setShowLayerMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);

    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const isProgrammaticMove = useRef<boolean>(false);

    // Initial Geolocation lookup on mount
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(coords);
                    setMapCenter(coords);
                    setMapZoom(17);
                },
                (err) => console.warn('Initial GPS check:', err),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    // Get reliable Tile URL based on style & dark/light theme
    const getTileUrl = (style: MapStyleType, isDarkMode: boolean) => {
        if (style === 'satellite') {
            return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
        }
        if (style === 'hybrid') {
            return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        }
        if (isDarkMode || style === 'cyber') {
            return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        }
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    };

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: mapCenter,
                zoom: mapZoom,
                zoomControl: false,
                attributionControl: false
            });

            const tileUrl = getTileUrl(mapStyle, isDark);
            const tileLayer = L.tileLayer(tileUrl, {
                maxZoom: 19,
                subdomains: ['a', 'b', 'c', 'd', 'mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(map);

            tileLayerRef.current = tileLayer;
            const layerGroup = L.layerGroup().addTo(map);
            markersGroupRef.current = layerGroup;
            mapInstanceRef.current = map;

            setTimeout(() => {
                map.invalidateSize();
            }, 100);

            map.on('zoomend', () => {
                setMapZoom(map.getZoom());
            });

            map.on('moveend', () => {
                if (isProgrammaticMove.current) {
                    isProgrammaticMove.current = false;
                    return;
                }
                const center = map.getCenter();
                setMapCenter([center.lat, center.lng]);
            });
        }

        const handleResize = () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Force map resize whenever maximize state changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [isMapMaximized]);

    // Update Tile Layer on Theme or Style change
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        if (tileLayerRef.current) {
            mapInstanceRef.current.removeLayer(tileLayerRef.current);
        }
        const tileUrl = getTileUrl(mapStyle, isDark);
        tileLayerRef.current = L.tileLayer(tileUrl, {
            maxZoom: 19,
            subdomains: ['a', 'b', 'c', 'd', 'mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.invalidateSize();
    }, [mapStyle, isDark]);

    // Render Markers & Route
    useEffect(() => {
        if (!mapInstanceRef.current || !markersGroupRef.current) return;

        markersGroupRef.current.clearLayers();

        const currentGps: [number, number] = userLocation || mapCenter;
        const [pickupLat, pickupLng] = currentGps;
        const dropoffLat = currentGps[0] + 0.012;
        const dropoffLng = currentGps[1] + 0.015;

        // Rapido-style Live GPS User Location Marker (anchored at real user GPS coordinates)
        const userLocationIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
        <div class="relative flex flex-col items-center group">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-12 h-12 rounded-full bg-emerald-400/40 animate-ping"></span>
            <span class="absolute w-7 h-7 rounded-full bg-emerald-400/50 animate-pulse"></span>
            <div class="w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-emerald-300 shadow-[0_0_20px_#10b981]"></div>
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-xl bg-slate-950/90 text-white border border-emerald-500/50 text-[10px] font-black shadow-2xl flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Your GPS Location
          </div>
        </div>
      `,
            iconSize: [120, 60],
            iconAnchor: [60, 30]
        });

        const dropoffIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
        <div class="relative flex flex-col items-center group">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-12 h-12 rounded-full bg-cyan-400/40 animate-ping"></span>
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0221bf] to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_#00f0ff] ring-4 ring-cyan-300/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-xl bg-slate-950/90 text-cyan-300 border border-cyan-400/50 text-[10px] font-black shadow-2xl flex items-center gap-1">
            Destination
          </div>
        </div>
      `,
            iconSize: [120, 60],
            iconAnchor: [60, 30]
        });

        L.marker(currentGps, { icon: userLocationIcon }).addTo(markersGroupRef.current);
        L.marker([dropoffLat, dropoffLng], { icon: dropoffIcon }).addTo(markersGroupRef.current);

        // Ambient Drivers
        MOCK_DRIVERS.forEach((d, idx) => {
            const driverLat = currentGps[0] + (idx === 0 ? 0.004 : idx === 1 ? -0.005 : 0.008);
            const driverLng = currentGps[1] + (idx === 0 ? -0.006 : idx === 1 ? 0.009 : -0.003);

            const driverIcon = L.divIcon({
                className: 'custom-driver-marker',
                html: `
          <div class="p-2 rounded-2xl bg-slate-900/90 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-125 transition-transform cursor-pointer flex items-center justify-center text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        `,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });

            L.marker([driverLat, driverLng], { icon: driverIcon }).addTo(markersGroupRef.current!);
        });

        // Polyline Route
        if (showRoute) {
            const latlngs: [number, number][] = [
                [pickupLat, pickupLng],
                [pickupLat + 0.005, pickupLng + 0.008],
                [dropoffLat - 0.004, dropoffLng - 0.006],
                [dropoffLat, dropoffLng]
            ];

            L.polyline(latlngs, {
                color: isDark ? '#00f0ff' : '#0221bf',
                weight: 6,
                opacity: 0.9,
                dashArray: '10, 10',
                lineCap: 'round'
            }).addTo(markersGroupRef.current);
        }
    }, [mapCenter, showRoute, isDark]);

    // Handle place search input
    const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 1) {
            setIsSearchingPlaces(true);
            const results = await searchPlaces(query);
            setSearchResults(results);
            setIsSearchingPlaces(false);
        } else {
            setSearchResults([]);
        }
    };

    const selectPlace = (place: any) => {
        setMapCenter([place.lat, place.lng]);
        setMapZoom(15);
        confirmLocations(pickup, place.name, [place.lat, place.lng]);
        setSearchResults([]);
        setSearchQuery('');
    };

    return (
        <div
            className={`relative transition-all duration-300 ease-in-out ${isMapMaximized
                ? 'fixed inset-0 z-50 w-full h-full bg-slate-950'
                : 'w-full h-full min-h-[380px]'
                }`}
        >
            {/* Leaflet Map Container */}
            <div
                ref={mapContainerRef}
                className="w-full h-full bg-slate-900 overflow-hidden"
            />

            {/* Top Search Bar */}
            {interactive && (
                <div className={`absolute ${isMapMaximized ? 'top-4' : 'top-20'} left-4 right-4 z-[9999] max-w-full transition-all duration-300`}>
                    <div className="relative flex items-center bg-white/95 dark:bg-[#051336]/90 rounded-2xl border border-slate-200/80 dark:border-cyan-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_35px_rgba(0,240,255,0.15)] p-1.5 backdrop-blur-2xl">
                        <div className="pl-3 text-cyan-500 flex items-center gap-1.5">
                            <Search className="w-4 h-4 text-[#0221bf] dark:text-cyan-400 animate-pulse" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            placeholder="Search place or airport..."
                            className="w-full px-3 py-1.5 bg-transparent text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-400/80"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors mr-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => setShowLayerMenu(!showLayerMenu)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-[#081d4f] text-slate-800 dark:text-cyan-300 hover:border-cyan-400 border border-slate-200/80 dark:border-cyan-500/30 shadow-md flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
                            title="Map Style Options"
                        >
                            <Layers className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Style</span>
                        </button>
                    </div>

                    {/* Search Autocomplete Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="mt-2.5 p-2 rounded-2xl glass-card border border-slate-200 dark:border-cyan-400/40 shadow-2xl space-y-1 backdrop-blur-2xl max-h-60 overflow-y-auto animate-fadeIn">
                            {searchResults.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => selectPlace(item)}
                                    className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyan-500/20 cursor-pointer flex items-center justify-between transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-cyan-500/20 border border-blue-200 dark:border-cyan-400/40 text-[#0221bf] dark:text-cyan-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#0221bf] dark:group-hover:text-cyan-400 transition-colors">
                                                {item.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-300 truncate max-w-[220px] font-semibold">
                                                {item.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Map Style Selector Popup */}
            {showLayerMenu && (
                <div className={`absolute ${isMapMaximized ? 'top-16' : 'top-36'} left-4 z-[9999] p-3.5 rounded-2xl bg-white/95 dark:bg-[#051336]/95 border border-slate-200 dark:border-cyan-400/40 shadow-2xl space-y-2.5 backdrop-blur-2xl animate-fadeIn transition-all duration-300`}>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-cyan-500/20">
                        <h4 className="text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-wider">
                            Map Aesthetics
                        </h4>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-cyan-300/70">Vector engine</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                        {[
                            { id: 'cyber', label: 'Dark Cyber', icon: <Moon className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" /> },
                            { id: 'roadmap', label: 'Roadmap', icon: <Navigation className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" /> },
                            { id: 'satellite', label: 'Satellite', icon: <LocateFixed className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" /> },
                            { id: 'hybrid', label: 'Hybrid', icon: <Layers className="w-3.5 h-3.5 text-[#0221bf] dark:text-cyan-400" /> }
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => {
                                    setMapStyle(style.id as MapStyleType);
                                    setShowLayerMenu(false);
                                }}
                                className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition-all ${mapStyle === style.id
                                    ? 'bg-gradient-to-r from-[#0221bf] to-cyan-500 text-white border-cyan-300 shadow-md shadow-cyan-500/20 scale-[1.02]'
                                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-cyan-400/50'
                                    }`}
                            >
                                <span>{style.icon}</span>
                                <span className="text-xs font-black">{style.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Map Controls: Stacked Vertically on Right Side of Map below Search Bar */}
            <div className={`absolute ${isMapMaximized ? 'top-16' : 'top-36'} right-4 z-[9999] flex flex-col gap-2.5 transition-all duration-300`}>

                {/* Maximum & Minimum Map Toggle Button */}
                <button
                    onClick={toggleMapMaximize}
                    className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all group backdrop-blur-xl"
                    title={isMapMaximized ? 'Minimize Map View' : 'Maximize Map View'}
                >
                    {isMapMaximized ? (
                        <Minimize2 className="w-5 h-5 text-[#0221bf] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                    ) : (
                        <Maximize2 className="w-5 h-5 text-[#0221bf] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                    )}
                </button>

                {/* Zoom In */}
                <button
                    onClick={() => {
                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.zoomIn();
                        }
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl"
                    title="Zoom In"
                >
                    <Plus className="w-5 h-5 text-[#0221bf] dark:text-cyan-400" />
                </button>

                {/* Zoom Out */}
                <button
                    onClick={() => {
                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.zoomOut();
                        }
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl"
                    title="Zoom Out"
                >
                    <Minus className="w-5 h-5 text-[#0221bf] dark:text-cyan-400" />
                </button>

                {/* Recenter / Current Location Target Button */}
                <button
                    onClick={() => {
                        if ('geolocation' in navigator) {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const { latitude, longitude } = position.coords;
                                    const newCoords: [number, number] = [latitude, longitude];
                                    setMapCenter(newCoords);
                                    setMapZoom(17);
                                    if (mapInstanceRef.current) {
                                        mapInstanceRef.current.flyTo(newCoords, 17, { animate: true, duration: 1.2 });
                                    }
                                },
                                (error) => {
                                    console.warn('Geolocation error/denial:', error);
                                    if (mapInstanceRef.current) {
                                        mapInstanceRef.current.flyTo(mapCenter, 17, { animate: true, duration: 1.2 });
                                    }
                                },
                                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                            );
                        } else if (mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo(mapCenter, 17, { animate: true, duration: 1.2 });
                        }
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl group"
                    title="Go to Current Location"
                >
                    <LocateFixed className="w-5.5 h-5.5 text-[#0221bf] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                </button>

            </div>
        </div>
    );
};
