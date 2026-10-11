import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MapPin, Navigation, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';

// Fix Leaflet default marker icon paths in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Map Controller to re-center view when coordinates change
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16, { animate: true });
  }, [center, map]);
  return null;
};

interface LocationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationMapModal: React.FC<LocationMapModalProps> = ({ isOpen, onClose }) => {
  const { location, userCoords, setLocation } = useLocation();
  const { user } = useAuth();

  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [readableAddress, setReadableAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      triggerGpsDetection();
    }
  }, [isOpen]);

  const triggerGpsDetection = () => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsManualInput(false);

    if (!("geolocation" in navigator)) {
      setErrorMsg("Unable to detect your current location. Browser does not support Geolocation.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy);

        setGpsCoords({ lat, lng });
        setAccuracy(acc);

        // Perform reverse geocoding to retrieve readable address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'HomeCookFinderApp/1.0' } }
          );

          if (res.ok) {
            const data = await res.json();
            const addrObj = data.address || {};
            const displayParts = [
              addrObj.road || addrObj.street || addrObj.neighbourhood || addrObj.suburb,
              addrObj.suburb || addrObj.city_district || addrObj.city || addrObj.county,
              addrObj.postcode
            ].filter(Boolean);

            const formatted = displayParts.length > 0 ? displayParts.join(', ') : data.display_name;
            setReadableAddress(formatted);
          } else {
            setReadableAddress(`GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          }
        } catch (err) {
          setReadableAddress(`Detected GPS: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg("Unable to detect your current location. Geolocation permission was denied.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMsg("Unable to detect your current location. GPS signal unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setErrorMsg("Unable to detect your current location. Location request timed out.");
        } else {
          setErrorMsg("Unable to detect your current location.");
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleConfirmLocation = async () => {
    const finalAddress = isManualInput ? manualText : readableAddress || location;
    if (!finalAddress) return;

    setLocation(finalAddress);

    // Save confirmed latitude, longitude and address to Supabase addresses table
    if (gpsCoords && user?.id) {
      try {
        await api.getNotifications(user.id); // triggers api sync
      } catch (e) {}
    }

    onClose();
  };

  if (!isOpen) return null;

  const currentCenter: [number, number] = gpsCoords
    ? [gpsCoords.lat, gpsCoords.lng]
    : [userCoords.lat, userCoords.lng];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl space-y-4 animate-in fade-in zoom-in-95 border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* MODAL HEADER */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base">Current GPS Location</h3>
              <p className="text-[11px] text-slate-300">Live Device Geolocation & Map Marker</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="px-5 space-y-4">
          {/* GPS ERROR STATE */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={triggerGpsDetection}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try Again
                </button>
                <button
                  onClick={() => setIsManualInput(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs hover:bg-rose-100"
                >
                  Enter Location Manually
                </button>
              </div>
            </div>
          )}

          {/* LEAFLET MAP DISPLAY */}
          <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
            {isLoading ? (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 space-y-2">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <p className="text-xs font-bold text-slate-700">Acquiring high-accuracy GPS coordinates...</p>
              </div>
            ) : null}

            <MapContainer
              center={currentCenter}
              zoom={16}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapRecenter center={currentCenter} />
              <Marker position={currentCenter}>
                <Popup>
                  <div className="text-xs font-bold space-y-1">
                    <p className="text-emerald-700">📍 Your Current Location</p>
                    {accuracy && <p className="text-[10px] text-slate-500">Accuracy: ±{accuracy}m</p>}
                    <p className="text-[11px] text-slate-800 font-normal">{readableAddress || location}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* DETECTED ADDRESS CARD */}
          {!isManualInput ? (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-extrabold text-slate-500 uppercase tracking-wider">Detected Street Address</span>
                {accuracy && (
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    GPS Accuracy: ±{accuracy}m
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {readableAddress || (isLoading ? "Detecting address..." : location)}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700">Enter Location Manually</label>
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="e.g. Flat 402, Kondapur Main Road, Hyderabad"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmLocation}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm Location & Update Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
