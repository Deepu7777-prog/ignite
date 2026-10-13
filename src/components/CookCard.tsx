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
    <div className="group bg-[#FFFDF7] rounded-[22px] border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:border-[#079669]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 relative">
      {/* Subtle botanical leaf silhouette in card corner */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-12 h-12 text-[#079669]/[0.05] absolute bottom-12 right-2 pointer-events-none"
      >
        <path
          d="M12 2C7.5 6 5 10.5 5 14.5C5 18.6 8.1 22 12 22C15.9 22 19 18.6 19 14.5C19 10.5 16.5 6 12 2Z"
          fill="currentColor"
        />
      </svg>

      <div>
        {/* PHOTO & BADGES HEADER */}
        <div className="relative h-48 w-full overflow-hidden bg-[#F1F8F1]">
          <img
            src={cook.photo}
            alt={cook.kitchenName}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#075C45]/75 via-[#123F35]/15 to-transparent" />

          {/* VERIFIED BADGE */}
          {cook.isVerified && (
            <div className="absolute top-3 left-3 bg-[#079669] text-[#FFFDF7] px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-[#CDEEDC]/40">
              <BadgeCheck className="w-3.5 h-3.5 text-[#CDEEDC] shrink-0" />
              VERIFIED
            </div>
          )}

          {/* FAVORITE BUTTON */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-[#FFFDF7]/90 backdrop-blur text-[#123F35] hover:bg-[#FFFDF7] hover:text-rose-500 border border-[#DDEEDF]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* DISTANCE & STARTING PRICE OVERLAY */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#FFFDF7] text-xs font-semibold">
            <span className="flex items-center gap-1 bg-[#123F35]/80 backdrop-blur px-2.5 py-1 rounded-xl border border-[#CDEEDC]/20">
              <MapPin className="w-3.5 h-3.5 text-[#CDEEDC]" />
              {dynamicDistance} km away
            </span>
            <span className="bg-[#075C45]/95 backdrop-blur px-2.5 py-1 rounded-xl font-extrabold text-[#FFFDF7] border border-[#CDEEDC]/30">
              From ₹{cook.startingPrice}
            </span>
          </div>
        </div>

        {/* CARD CONTENT */}
        <div className="p-5 relative z-10">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display font-extrabold text-[#123F35] text-lg group-hover:text-[#079669] transition-colors leading-snug">
                {cook.kitchenName}
              </h3>
              <p className="text-xs text-[#123F35]/70 font-medium">
                By {cook.ownerName} • {cook.location}
              </p>
            </div>
            {/* RATING BADGE */}
            <div className="flex items-center gap-1 bg-[#F8F4E8] border border-[#E8D99A] text-[#075C45] px-2 py-1 rounded-xl text-xs font-black shrink-0">
              <Star className="w-3.5 h-3.5 text-[#D4A838] fill-[#D4A838]" />
              <span>{cook.rating}</span>
              <span className="text-[#123F35]/55 font-medium text-[10px]">({cook.reviewCount})</span>
            </div>
          </div>

          {/* CUISINE CHIPS */}
          <div className="flex flex-wrap gap-1.5 my-3">
            {cook.cuisines.map((c) => (
              <span
                key={c}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45]"
              >
                {c}
              </span>
            ))}
          </div>

          {/* BIO SNIPPET */}
          <p className="text-xs text-[#123F35]/75 line-clamp-2 leading-relaxed mb-4 font-medium">
            {cook.bio}
          </p>
        </div>
      </div>

      {/* CARD FOOTER BUTTON */}
      <div className="px-5 pb-5 pt-0 relative z-10">
        <Link
          to={`/cook/${cook.id}`}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#F8F4E8] hover:bg-[#079669] text-[#075C45] hover:text-[#FFFDF7] border border-[#DDEEDF] hover:border-[#079669] font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-2xs hover:shadow-sm"
        >
          <Utensils className="w-3.5 h-3.5" />
          View Kitchen & Menu
        </Link>
      </div>
    </div>
  );
};
