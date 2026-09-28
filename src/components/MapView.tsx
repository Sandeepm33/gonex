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
    Moon,
    ArrowRightLeft,
    Compass,
    Target
} from 'lucide-react';
import { useRide, MapStyleType } from '../context/RideContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_DRIVERS } from '../constants/mockData';
import { searchPlaces, reverseGeocode, PlaceItem } from '../services/locationService';

interface MapViewProps {
    showRoute?: boolean;
    showDriver?: boolean;
    isSearching?: boolean;
    interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
    showRoute = true,
    showDriver = false,
    isSearching = false,
    interactive = true
}) => {
    const {
        pickup,
        destination,
        pickupCoords,
        destinationCoords,
        setPickupCoords,
        setDestinationCoords,
        selectPickupLocation,
        selectDestinationLocation,
        activeMapSelectionMode,
        setActiveMapSelectionMode,
        routeOptions,
        selectedRouteIndex,
        setSelectedRouteIndex,
        confirmLocations,
        isMapMaximized,
        toggleMapMaximize,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        mapStyle,
        setMapStyle,
        useCurrentLocation,
        isLocatingUser
    } = useRide();

    const { isDark } = useTheme();

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const markersGroupRef = useRef<L.LayerGroup | null>(null);

    const [showLayerMenu, setShowLayerMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PlaceItem[]>([]);
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
                },
                (err) => console.warn('Initial GPS check:', err),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    // Get Tile URL based on style & dark/light theme
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

    // Handle Map Clicks for direct interactive location selection
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        const handleMapClick = async (e: L.LeafletMouseEvent) => {
            const clickedCoords: [number, number] = [e.latlng.lat, e.latlng.lng];
            const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);

            if (activeMapSelectionMode === 'pickup') {
                selectPickupLocation(address, clickedCoords);
                setActiveMapSelectionMode(null);
            } else if (activeMapSelectionMode === 'destination') {
                selectDestinationLocation(address, clickedCoords);
                setActiveMapSelectionMode(null);
            }
        };

        map.on('click', handleMapClick);
        return () => {
            map.off('click', handleMapClick);
        };
    }, [activeMapSelectionMode]);

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

    // Auto-fit bounds to include pickup and destination markers when route is displayed
    const fitRouteBounds = () => {
        if (!mapInstanceRef.current) return;
        const bounds = L.latLngBounds([pickupCoords, destinationCoords]);
        mapInstanceRef.current.fitBounds(bounds, {
            padding: [60, 60],
            maxZoom: 16,
            animate: true
        });
    };

    useEffect(() => {
        if (showRoute && mapInstanceRef.current && pickupCoords && destinationCoords) {
            fitRouteBounds();
        }
    }, [pickupCoords, destinationCoords, showRoute]);

    // Render Markers & Route Polylines
    useEffect(() => {
        if (!mapInstanceRef.current || !markersGroupRef.current) return;

        markersGroupRef.current.clearLayers();

        // 1. User GPS Pin
        if (userLocation) {
            const gpsIcon = L.divIcon({
                className: 'custom-leaflet-marker',
                html: `
            <div class="relative flex flex-col items-center group">
              <div class="relative flex items-center justify-center">
                <span class="absolute w-10 h-10 rounded-full bg-emerald-400/30 animate-ping"></span>
                <div class="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-300 shadow-[0_0_15px_#10b981]"></div>
              </div>
            </div>
          `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            L.marker(userLocation, { icon: gpsIcon }).addTo(markersGroupRef.current);
        }

        // 2. Pickup Marker (Blue/Cyan Pin matching Destination)
        const pickupIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
        <div class="relative flex flex-col items-center group">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-12 h-12 rounded-full bg-blue-500/30 animate-ping"></span>
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0221bf] via-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_#00f0ff] ring-4 ring-cyan-300/60">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
            </div>
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-xl bg-slate-950/90 text-cyan-300 border border-cyan-400/60 text-[10px] font-black shadow-2xl flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Pickup Location
          </div>
        </div>
      `,
            iconSize: [120, 65],
            iconAnchor: [60, 32]
        });

        // 3. Destination Marker (Cyan/Blue Pin)
        const dropoffIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
        <div class="relative flex flex-col items-center group">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-12 h-12 rounded-full bg-cyan-400/30 animate-ping"></span>
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0221bf] to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_#00f0ff] ring-4 ring-cyan-300/60">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-xl bg-slate-950/90 text-cyan-300 border border-cyan-400/60 text-[10px] font-black shadow-2xl flex items-center gap-1">
            Destination
          </div>
        </div>
      `,
            iconSize: [120, 65],
            iconAnchor: [60, 32]
        });

        L.marker(pickupCoords, { icon: pickupIcon }).addTo(markersGroupRef.current);
        L.marker(destinationCoords, { icon: dropoffIcon }).addTo(markersGroupRef.current);

        // 4. Ambient Drivers
        if (showDriver) {
            MOCK_DRIVERS.forEach((d, idx) => {
                const driverLat = pickupCoords[0] + (idx === 0 ? 0.003 : idx === 1 ? -0.004 : 0.006);
                const driverLng = pickupCoords[1] + (idx === 0 ? -0.004 : idx === 1 ? 0.007 : -0.003);

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
        }

        // 5. Route Polylines & Interactive Selection (Google Maps Style)
        if (showRoute && routeOptions && routeOptions.length > 0) {
            routeOptions.forEach((opt, idx) => {
                if (!opt.coordinates || opt.coordinates.length === 0) return;

                const isSelected = idx === selectedRouteIndex;

                // A. Wide invisible hit-area polyline for easy tapping anywhere along the route
                const hitAreaPolyline = L.polyline(opt.coordinates, {
                    weight: 24,
                    opacity: 0,
                    interactive: true
                });

                hitAreaPolyline.on('click', () => {
                    setSelectedRouteIndex(idx);
                });
                hitAreaPolyline.addTo(markersGroupRef.current!);

                // B. Visible route line rendering
                if (!isSelected) {
                    // Inactive Alternate Route (Muted Gray Dashed Line)
                    const altPolyline = L.polyline(opt.coordinates, {
                        color: isDark ? '#64748b' : '#94a3b8',
                        weight: 6,
                        opacity: 0.7,
                        dashArray: '8, 8',
                        lineCap: 'round',
                        interactive: true
                    });
                    altPolyline.on('click', () => setSelectedRouteIndex(idx));
                    altPolyline.addTo(markersGroupRef.current!);
                } else {
                    // Active Selected Route (Glowing Solid Neon Blue Line)
                    const glowPolyline = L.polyline(opt.coordinates, {
                        color: isDark ? '#00f0ff' : '#0221bf',
                        weight: 12,
                        opacity: 0.35,
                        lineCap: 'round',
                        lineJoin: 'round',
                        interactive: false
                    });
                    glowPolyline.addTo(markersGroupRef.current!);

                    const activePolyline = L.polyline(opt.coordinates, {
                        color: isDark ? '#00f0ff' : '#0221bf',
                        weight: 8,
                        opacity: 1,
                        lineCap: 'round',
                        lineJoin: 'round',
                        interactive: true
                    });
                    activePolyline.on('click', () => setSelectedRouteIndex(idx));
                    activePolyline.addTo(markersGroupRef.current!);
                }

                // C. Midpoint Floating Route Badge Pill (Google Maps Style)
                const midIndex = Math.floor(opt.coordinates.length / 2);
                const midPoint = opt.coordinates[midIndex];

                if (midPoint) {
                    const badgeIcon = L.divIcon({
                        className: 'custom-leaflet-marker cursor-pointer',
                        html: `
                            <div class="px-2.5 py-1 rounded-xl text-[10px] font-black shadow-xl flex items-center gap-1 transition-transform hover:scale-110 active:scale-95 border ${isSelected
                                ? 'bg-gradient-to-r from-[#0221bf] to-cyan-500 text-white border-cyan-300 ring-2 ring-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                                : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-cyan-400'
                            }">
                                <span>${isSelected ? '⚡ ' : ''}${opt.name || `Route ${idx + 1}`}</span>
                                <span class="opacity-85">• ${opt.durationMinutes} min</span>
                            </div>
                        `,
                        iconSize: [110, 30],
                        iconAnchor: [55, 15]
                    });

                    const badgeMarker = L.marker(midPoint, { icon: badgeIcon, interactive: true });
                    badgeMarker.on('click', () => setSelectedRouteIndex(idx));
                    badgeMarker.addTo(markersGroupRef.current!);
                }
            });
        }
    }, [pickupCoords, destinationCoords, routeOptions, selectedRouteIndex, showRoute, showDriver, isDark, userLocation]);

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

    const selectPlace = (place: PlaceItem) => {
        setDestinationCoords([place.lat, place.lng]);
        setMapCenter([place.lat, place.lng]);
        setMapZoom(15);
        confirmLocations(pickup, place.name, pickupCoords, [place.lat, place.lng]);
        setSearchResults([]);
        setSearchQuery('');
    };

    return (
        <div
            className={`relative transition-all duration-300 ease-in-out w-full h-full ${isMapMaximized ? 'fixed inset-0 z-[9999] bg-slate-950' : 'relative'
                }`}
        >
            {/* Leaflet Map Container */}
            <div
                ref={mapContainerRef}
                className="w-full h-full bg-slate-900 overflow-hidden"
            />

            {/* Active Map Selection Indicator Prompt */}
            {activeMapSelectionMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full bg-slate-950/90 text-cyan-300 border border-cyan-400/60 shadow-2xl backdrop-blur-xl text-xs font-extrabold flex items-center gap-2 animate-bounce">
                    <Target className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>Tap anywhere on the map to set {activeMapSelectionMode === 'pickup' ? 'Pickup' : 'Destination'} location</span>
                    <button
                        onClick={() => setActiveMapSelectionMode(null)}
                        className="ml-2 p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Top Search Bar */}
            {interactive && !activeMapSelectionMode && (
                <div className={`absolute ${isMapMaximized ? 'top-4' : 'top-4'} left-4 right-4 z-[9999] max-w-full transition-all duration-300`}>
                    <div className="relative flex items-center bg-white/95 dark:bg-[#051336]/90 rounded-2xl border border-slate-200/80 dark:border-cyan-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_35px_rgba(0,240,255,0.15)] p-1.5 backdrop-blur-2xl">
                        <div className="pl-3 text-cyan-500 flex items-center gap-1.5">
                            <Search className="w-4 h-4 text-[#0221bf] dark:text-cyan-400 animate-pulse" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            placeholder="Search place, airport, or address..."
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
                    </div>
                </div>
            )}

            {/* Map Controls: Stacked Vertically on Right Side */}
            <div className={`absolute ${isMapMaximized ? 'top-16' : 'top-20'} right-4 z-[9999] flex flex-col gap-2.5 transition-all duration-300`}>

                {/* Maximum & Minimum Map Toggle Button */}
                <button
                    onClick={toggleMapMaximize}
                    className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all group backdrop-blur-xl"
                    title={isMapMaximized ? 'Minimize Map View' : 'Maximize Map View'}
                >
                    {isMapMaximized ? (
                        <Minimize2 className="w-4.5 h-4.5 text-[#0221bf] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                    ) : (
                        <Maximize2 className="w-4.5 h-4.5 text-[#0221bf] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                    )}
                </button>

                {/* Fit Route Bounds Button */}
                {showRoute && (
                    <button
                        onClick={fitRouteBounds}
                        className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl group"
                        title="Fit Full Route on Map"
                    >
                        <Compass className="w-4.5 h-4.5 text-[#0221bf] dark:text-cyan-400 group-hover:rotate-45 transition-transform" />
                    </button>
                )}

                {/* Zoom In */}
                <button
                    onClick={() => {
                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.zoomIn();
                        }
                    }}
                    className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl"
                    title="Zoom In"
                >
                    <Plus className="w-4.5 h-4.5 text-[#0221bf] dark:text-cyan-400" />
                </button>

                {/* Zoom Out */}
                <button
                    onClick={() => {
                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.zoomOut();
                        }
                    }}
                    className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl"
                    title="Zoom Out"
                >
                    <Minus className="w-4.5 h-4.5 text-[#0221bf] dark:text-cyan-400" />
                </button>

                {/* Recenter / Current Location Button */}
                <button
                    onClick={async () => {
                        await useCurrentLocation();
                        if (mapInstanceRef.current && userLocation) {
                            mapInstanceRef.current.flyTo(userLocation, 17, { animate: true, duration: 1.2 });
                        }
                    }}
                    className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#051336]/90 border border-slate-200 dark:border-cyan-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#0221bf] dark:text-cyan-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl group"
                    title="Use Current Location"
                >
                    <LocateFixed className={`w-5 h-5 text-[#0221bf] dark:text-cyan-400 group-hover:scale-110 transition-transform ${isLocatingUser ? 'animate-spin text-emerald-400' : ''}`} />
                </button>

            </div>
        </div>
    );
};

