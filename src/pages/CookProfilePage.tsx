import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CookProfile, MenuItem, Review } from '../types';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { useAuth } from '../context/AuthContext';
import {
  BadgeCheck,
  Star,
  MapPin,
  Clock,
  Heart,
  MessageSquare,
  ShieldCheck,
  Award,
  Calendar,
  Utensils
} from 'lucide-react';

export const CookProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cook, setCook] = useState<CookProfile | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { user, isDemo } = useAuth();

  useEffect(() => {
    if (id) {
      loadCookProfile(id);
    }
  }, [id]);

  const loadCookProfile = async (cookId: string) => {
    try {
      setLoading(true);
      const res = await api.getCookById(cookId);
      if (res.success) {
        setCook(res.cook);
        setMenuItems(res.menuItems);
        setReviews(res.reviews);

        // Check if favorite
        const favUserId = user?.id || (isDemo ? 'usr_customer_demo' : null);
        if (favUserId) {
          const favRes = await api.getFavorites(favUserId);
          if (favRes.success) {
            setIsFavorite(favRes.favorites.some((f) => f.cookId === cookId));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load cook profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!cook) return;
    try {
      const customerId = user?.id || (isDemo ? 'usr_customer_demo' : 'guest_customer');
      const res = await api.toggleFavorite(customerId, cook.id);
      setIsFavorite(res.isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading home kitchen profile...</p>
      </div>
    );
  }

  if (!cook) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-extrabold text-slate-900 text-xl mb-2">Home Cook Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The kitchen profile you requested does not exist.</p>
        <Link to="/explore" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
          Explore Other Cooks
        </Link>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(menuItems.map((i) => i.category)))];

  const filteredMenuItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* HEADER KITCHEN BANNER & PROFILE INFO */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={cook.photo}
            alt={cook.kitchenName}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* TOP ACTIONS */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-800 hover:bg-white hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* BOTTOM KITCHEN TITLE OVERLAY */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {cook.isVerified && (
                <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur text-white text-xs font-extrabold flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  Verified Kitchen
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-slate-200 text-xs font-semibold">
                ★ {cook.rating} ({cook.reviewCount} Reviews)
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-slate-200 text-xs font-semibold">
                {cook.distanceKm} km away
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              {cook.kitchenName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              By {cook.ownerName} • {cook.location} • {cook.experienceYears} Years Cooking Experience
            </p>
          </div>
        </div>

        {/* DETAILS STRIP & BIO */}
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Prep Time: {cook.prepTimeMinutes} mins after order</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>FSSAI License: {cook.fssaiNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Video Call Verified (Re-checked in {cook.nextCheckDays}d)</span>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">About the Kitchen</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {cook.bio}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-center mr-2">
              Cuisines:
            </span>
            {cook.cuisines.map((c) => (
              <span key={c} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MENU CATEGORIES & FOOD ITEMS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-display text-2xl font-extrabold text-slate-900">
            Kitchen Menu & Today's Items
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {filteredMenuItems.length} Items Available
          </span>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FOOD ITEMS GRID */}
        {filteredMenuItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
            <p className="text-xs text-slate-500">No dishes listed under this category today.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                cookId={cook.id}
                cookName={cook.kitchenName}
              />
            ))}
          </div>
        )}
      </div>

      {/* REVIEWS & RATINGS SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-extrabold text-slate-900">
            Customer Reviews & Ratings
          </h3>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            ★ {cook.rating} / 5.0 Average
          </span>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No reviews submitted yet for this kitchen.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">{rev.customerName}</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {rev.rating}/5
                  </span>
                </div>
                {rev.dishRating && (
                  <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded-md">
                    {rev.dishRating}
                  </p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
