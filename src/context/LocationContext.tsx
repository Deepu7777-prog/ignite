import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  calculateHaversineDistance,
  HYDERABAD_LOCALITIES,
  findClosestLocality,
  LocalityCoords
} from '../utils/distance';

interface LocationContextType {
  location: string;
  userCoords: { lat: number; lng: number } | null;
  locationError: string | null;
  isGpsDetected: boolean;
  setLocation: (locName: string) => void;
  detectLocation: () => Promise<boolean>;
  isDetecting: boolean;
  availableLocations: string[];
  searchLocations: (query: string) => string[];
  getDistanceToCook: (cookLat: number, cookLng: number) => number;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<string>(() => {
    return localStorage.getItem('hcf_user_location') || "Madhapur, Hyderabad";
  });

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('hcf_user_coords');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { lat: 17.4483, lng: 78.3915 };
  });

  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGpsDetected, setIsGpsDetected] = useState<boolean>(false);

  const availableLocations = HYDERABAD_LOCALITIES.map((l) => l.name);

  const setLocation = (locName: string) => {
    setLocationState(locName);
    setLocationError(null);
    localStorage.setItem('hcf_user_location', locName);

    // Find matching coords if available
    const matched = HYDERABAD_LOCALITIES.find(
      (l) => l.name.toLowerCase().includes(locName.toLowerCase()) || locName.toLowerCase().includes(l.name.split(',')[0].toLowerCase())
    );

    if (matched) {
      const coords = { lat: matched.lat, lng: matched.lng };
      setUserCoords(coords);
      localStorage.setItem('hcf_user_coords', JSON.stringify(coords));
    }
  };

  const detectLocation = async (): Promise<boolean> => {
    setIsDetecting(true);
    setLocationError(null);
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const newCoords = { lat: latitude, lng: longitude };
            setUserCoords(newCoords);
            setIsGpsDetected(true);
            setLocationError(null);
            localStorage.setItem('hcf_user_coords', JSON.stringify(newCoords));

            try {
              // Real OpenStreetMap reverse geocoding API
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                { headers: { 'User-Agent': 'HomeCookFinder/1.0' } }
              );

              if (res.ok) {
                const data = await res.json();
                const address = data.address;
                const suburb = address?.suburb || address?.neighbourhood || address?.residential || address?.road || address?.subdistrict || address?.city_district;
                const city = address?.city || address?.town || address?.county || address?.state_district;
                
                let detectedName = '';
                if (suburb && city) {
                  detectedName = `${suburb}, ${city}`;
                } else if (city) {
                  detectedName = `${city}`;
                } else if (suburb) {
                  detectedName = `${suburb}`;
                } else if (data.display_name) {
                  detectedName = data.display_name.split(',').slice(0, 2).join(',').trim();
                }

                if (detectedName) {
                  setLocationState(detectedName);
                  localStorage.setItem('hcf_user_location', detectedName);
                  setIsDetecting(false);
                  resolve(true);
                  return;
                }
              }
            } catch (err) {
              console.warn("Reverse geocoding failed online:", err);
            }

            // Real coordinate fallback without hardcoding any location
            const fallbackLoc = `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
            setLocationState(fallbackLoc);
            localStorage.setItem('hcf_user_location', fallbackLoc);
            setIsDetecting(false);
            resolve(true);
          },
          (error) => {
            console.warn("Geolocation permission error:", error);
            setIsDetecting(false);
            setIsGpsDetected(false);
            if (error.code === 1) {
              setLocationError("Location permission was denied. Please allow location access in your browser or select your neighbourhood manually.");
            } else {
              setLocationError("Unable to acquire GPS signal. Please select your neighbourhood manually.");
            }
            resolve(false);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        setIsDetecting(false);
        setIsGpsDetected(false);
        setLocationError("Geolocation is not supported by your browser.");
        resolve(false);
      }
    });
  };

  const searchLocations = (query: string): string[] => {
    if (!query.trim()) return availableLocations;
    const q = query.toLowerCase().trim();
    return availableLocations.filter((loc) => loc.toLowerCase().includes(q));
  };

  const getDistanceToCook = (cookLat: number, cookLng: number): number => {
    if (!userCoords) return 2.5;
    return calculateHaversineDistance(userCoords.lat, userCoords.lng, cookLat, cookLng);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        userCoords,
        locationError,
        isGpsDetected,
        setLocation,
        detectLocation,
        isDetecting,
        availableLocations,
        searchLocations,
        getDistanceToCook,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
