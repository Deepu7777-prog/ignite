import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CookProfile } from '../types';
import { Star, MapPin, BadgeCheck, Heart, Utensils } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

interface CookCardProps {
  cook: CookProfile;
  initialIsFavorite?: boolean;
}

export const CookCard: React.FC<CookCardProps> = ({ cook, initialIsFavorite = false }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(initialIsFavorite);
  const { user, isDemo, openAuthModal } = useAuth();
  const { getDistanceToCook } = useLocation();

  // Compute dynamic distance from user's current detected location to kitchen
  const dynamicDistance = cook.lat && cook.lng ? getDistanceToCook(cook.lat, cook.lng) : cook.distanceKm;

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user && !isDemo) {
      openAuthModal('LOGIN');
      return;
    }
    try {
      const customerId = user?.id || (isDemo ? 'usr_customer_demo' : '');
      const res = await api.toggleFavorite(customerId, cook.id);
      setIsFavorite(res.isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="group bg-[#fffdfa] rounded-3xl border border-[#ebdcc7]/90 shadow-soft hover:shadow-card-hover hover:border-emerald-300/90 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* PHOTO & BADGES HEADER */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={cook.photo}
            alt={cook.kitchenName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {/* VERIFIED BADGE */}
          {cook.isVerified && (
            <div className="absolute top-3 left-3 bg-[#fffdfa]/95 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-extrabold text-[#113923] flex items-center gap-1.5 shadow-soft border border-[#ebdcc7]">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Verified Kitchen
            </div>
          )}

          {/* FAVORITE BUTTON */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/85 backdrop-blur text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* DISTANCE & STARTING PRICE OVERLAY */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <span className="flex items-center gap-1 bg-slate-900/65 backdrop-blur px-2.5 py-1 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {dynamicDistance} km away
            </span>
            <span className="bg-emerald-700/95 backdrop-blur px-2.5 py-1 rounded-xl font-bold">
              From ₹{cook.startingPrice}
            </span>
          </div>
        </div>

        {/* CARD CONTENT */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display font-extrabold text-[#113923] text-lg group-hover:text-emerald-700 transition-colors leading-snug">
                {cook.kitchenName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                By {cook.ownerName} • {cook.location}
              </p>
            </div>
            {/* RATING BADGE */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/90 text-amber-900 px-2 py-1 rounded-xl text-xs font-black shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{cook.rating}</span>
              <span className="text-slate-400 font-medium text-[10px]">({cook.reviewCount})</span>
            </div>
          </div>

          {/* CUISINE CHIPS */}
          <div className="flex flex-wrap gap-1.5 my-3">
            {cook.cuisines.map((c) => (
              <span
                key={c}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#edf4ee] border border-[#cde1d3]/80 text-[#133826]"
              >
                {c}
              </span>
            ))}
          </div>

          {/* BIO SNIPPET */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 font-medium">
            {cook.bio}
          </p>
        </div>
      </div>

      {/* CARD FOOTER BUTTON */}
      <div className="px-5 pb-5 pt-0">
        <Link
          to={`/cook/${cook.id}`}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#fcfaf7] hover:bg-emerald-700 text-[#123924] hover:text-white border border-[#ebdcc7] hover:border-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-2xs hover:shadow-xs"
        >
          <Utensils className="w-3.5 h-3.5" />
          View Kitchen & Menu
        </Link>
      </div>
    </div>
  );
};
