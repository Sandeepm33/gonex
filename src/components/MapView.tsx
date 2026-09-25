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
    Compass,
    Check,
    X,
    Calendar,
    Clock
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

    // Get reliable Tile URL based on style & dark/light theme
    const getTileUrl = (style: MapStyleType, isDarkMode: boolean) => {
        if (style === 'satellite') {
            return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
        }
        if (style === 'hybrid') {
            return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        }
        if (isDarkMode) {
            // Crisp, watermark-free Esri World Dark Gray Canvas for dark cyber theme
            return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        }
        // Crisp Google Roadmap map tiles for light theme
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

            // Immediately force invalidateSize after DOM mount to prevent blank tiles
            setTimeout(() => {
                map.invalidateSize();
            }, 100);

            // Handle zoom & pan sync
            map.on('zoomend', () => {
                setMapZoom(map.getZoom());
            });
            map.on('moveend', () => {
                const center = map.getCenter();
                setMapCenter([center.lat, center.lng]);
            });
        } else {
            mapInstanceRef.current.setView(mapCenter, mapZoom, { animate: true });
        }

        // Window resize listener
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

    // Update center
    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(mapCenter, mapZoom, { duration: 1.2 });
        }
    }, [mapCenter, mapZoom]);

    // Render Markers & Route
    useEffect(() => {
        if (!mapInstanceRef.current || !markersGroupRef.current) return;

        markersGroupRef.current.clearLayers();

        const pickupLat = mapCenter[0] - 0.008;
        const pickupLng = mapCenter[1] - 0.012;
        const dropoffLat = mapCenter[0] + 0.012;
        const dropoffLng = mapCenter[1] + 0.015;

        // Custom HTML Markers
        const pickupIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
        <div class="relative flex flex-col items-center group">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-10 h-10 rounded-full bg-emerald-400/40 animate-ping"></span>
            <div class="w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-emerald-400/60 shadow-[0_0_20px_#10b981]"></div>
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-xl bg-slate-950/90 text-white border border-emerald-500/50 text-[10px] font-black shadow-2xl flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Pickup Point
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
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0221bf] to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_#00f0ff] ring-4 ring-cyan-300/50 font-bold">
              📍
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

        L.marker([pickupLat, pickupLng], { icon: pickupIcon }).addTo(markersGroupRef.current);
        L.marker([dropoffLat, dropoffLng], { icon: dropoffIcon }).addTo(markersGroupRef.current);

        // Ambient Drivers
        MOCK_DRIVERS.forEach((d, idx) => {
            const driverLat = mapCenter[0] + (idx === 0 ? 0.004 : idx === 1 ? -0.005 : 0.008);
            const driverLng = mapCenter[1] + (idx === 0 ? -0.006 : idx === 1 ? 0.009 : -0.003);

            const driverIcon = L.divIcon({
                className: 'custom-driver-marker',
                html: `
          <div class="p-2 rounded-2xl bg-slate-900/90 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.4)] text-base hover:scale-125 transition-transform cursor-pointer">
            🏎️
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
                    <div className="relative flex items-center bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-cyan-400/40 shadow-xl p-1 backdrop-blur-xl">
                        <div className="pl-3 text-cyan-500 flex items-center gap-1.5">
                            <Search className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            placeholder="Search place..."
                            className="w-full px-2.5 py-1.5 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            onClick={() => setShowLayerMenu(!showLayerMenu)}
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-cyan-300 hover:border-cyan-400 border border-transparent shadow-sm shrink-0"
                            title="Toggle Google Map Style"
                        >
                            <Layers className="w-4 h-4 text-[#0221bf] dark:text-cyan-400" />
                        </button>
                    </div>

                    {/* Search Autocomplete Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="mt-2 p-2 rounded-2xl glass-card border border-slate-200 dark:border-cyan-400/40 shadow-2xl space-y-1 backdrop-blur-2xl max-h-60 overflow-y-auto">
                            {searchResults.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => selectPlace(item)}
                                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-cyan-500/20 cursor-pointer flex items-center justify-between transition-all group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-cyan-500/20 border border-blue-200 dark:border-cyan-400/40 text-[#0221bf] dark:text-cyan-400 flex items-center justify-center">
                                            <MapPin className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#0221bf] dark:group-hover:text-cyan-400 transition-colors">
                                                {item.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-300 truncate max-w-[200px]">
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
                <div className={`absolute ${isMapMaximized ? 'top-16' : 'top-36'} left-4 z-[9999] p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-400/40 shadow-2xl space-y-2 backdrop-blur-xl animate-fadeIn transition-all duration-300`}>
                    <h4 className="text-[10px] font-black uppercase text-[#0221bf] dark:text-cyan-400 tracking-wider">
                        Google Map Style
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                        {[
                            { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
                            { id: 'satellite', label: 'Satellite', icon: '🛰️' },
                            { id: 'hybrid', label: 'Hybrid', icon: '🌐' }
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => {
                                    setMapStyle(style.id as MapStyleType);
                                    setShowLayerMenu(false);
                                }}
                                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 border transition-all ${mapStyle === style.id
                                    ? 'bg-gradient-to-tr from-[#0221bf] to-cyan-500 text-white border-cyan-400 shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-cyan-400/50'
                                    }`}
                            >
                                <span>{style.icon}</span>
                                <span>{style.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Map Controls: Stacked Vertically on Right Side of Map below Search Bar */}
            <div className={`absolute ${isMapMaximized ? 'top-16' : 'top-36'} right-4 z-[9999] flex flex-col gap-2 transition-all duration-300`}>

                {/* Maximum & Minimum Map Toggle Button */}
                <button
                    onClick={toggleMapMaximize}
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-400/40 shadow-xl flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all group"
                    title={isMapMaximized ? 'Minimize Map' : 'Maximize Map'}
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
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-400/40 shadow-xl flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all"
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
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-400/40 shadow-xl flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all"
                    title="Zoom Out"
                >
                    <Minus className="w-5 h-5 text-[#0221bf] dark:text-cyan-400" />
                </button>

                {/* Recenter / Compass Button */}
                <button
                    onClick={() => {
                        setMapCenter([41.8781, -87.6298]);
                        setMapZoom(13);
                    }}
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-400/40 shadow-xl flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all"
                    title="Recenter Location"
                >
                    <Compass className="w-5 h-5 text-[#0221bf] dark:text-cyan-400 animate-spin-slow" />
                </button>

            </div>
        </div>
    );
};
