import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  calculateHaversineDistance,
  HYDERABAD_LOCALITIES,
  findClosestLocality,
  LocalityCoords
} from '../utils/distance';

interface LocationContextType {
  location: string;
  userCoords: { lat: number; lng: number };
  setLocation: (locName: string) => void;
  detectLocation: () => Promise<void>;
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

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>(() => {
    const saved = localStorage.getItem('hcf_user_coords');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { lat: 17.4483, lng: 78.3915 }; // Default Madhapur
  });

  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const availableLocations = HYDERABAD_LOCALITIES.map((l) => l.name);

  const setLocation = (locName: string) => {
    setLocationState(locName);
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

  const detectLocation = async (): Promise<void> => {
    setIsDetecting(true);
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const newCoords = { lat: latitude, lng: longitude };
            setUserCoords(newCoords);
            localStorage.setItem('hcf_user_coords', JSON.stringify(newCoords));

            try {
              // Try OpenStreetMap reverse geocoding API
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                { headers: { 'User-Agent': 'HomeCookFinder/1.0' } }
              );

              if (res.ok) {
                const data = await res.json();
                const address = data.address;
                const suburb = address?.suburb || address?.neighbourhood || address?.residential || address?.road || address?.city_district;
                
                if (suburb) {
                  const detectedName = `${suburb}, Hyderabad`;
                  setLocationState(detectedName);
                  localStorage.setItem('hcf_user_location', detectedName);
                  setIsDetecting(false);
                  resolve();
                  return;
                }
              }
            } catch (err) {
              console.warn("Reverse geocoding failed, falling back to nearest locality:", err);
            }

            // Fallback: match closest known locality in Hyderabad
            const closest = findClosestLocality(latitude, longitude);
            setLocationState(closest.name);
            localStorage.setItem('hcf_user_location', closest.name);
            setIsDetecting(false);
            resolve();
          },
          (error) => {
            console.warn("Geolocation permission denied or error:", error);
            // Default fallback to Madhapur
            setLocationState("Madhapur, Hyderabad");
            setIsDetecting(false);
            resolve();
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      } else {
        setLocationState("Madhapur, Hyderabad");
        setIsDetecting(false);
        resolve();
      }
    });
  };

  const searchLocations = (query: string): string[] => {
    if (!query.trim()) return availableLocations;
    const q = query.toLowerCase().trim();
    return availableLocations.filter((loc) => loc.toLowerCase().includes(q));
  };

  const getDistanceToCook = (cookLat: number, cookLng: number): number => {
    return calculateHaversineDistance(userCoords.lat, userCoords.lng, cookLat, cookLng);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        userCoords,
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
