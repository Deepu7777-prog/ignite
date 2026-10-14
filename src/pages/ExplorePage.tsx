import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CookProfile } from '../types';
import { api } from '../services/api';
import { CookCard } from '../components/CookCard';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, MapPin, Star, Utensils, Check, LogIn } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cooks, setCooks] = useState<CookProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState<string>(searchParams.get('cuisine') || 'All');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(searchParams.get('isVeg') === 'true');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [availableToday, setAvailableToday] = useState<boolean>(false);

  const cuisinesList = [
    'All',
    'Andhra',
    'North Indian',
    'Rayalaseema',
    'Tiffins',
    'South Indian',
    'Pure Veg',
    'Telangana',
    'Healthy',
    'Seafood',
    'Sweets',
    'Festival Specials'
  ];

  useEffect(() => {
    if (user) {
      loadCooks();
    }
  }, [user, search, selectedCuisine, isVegOnly, minRating, maxDistance, availableToday]);

  const loadCooks = async () => {
    try {
      setLoading(true);
      const res = await api.getCooks({
        search: search || undefined,
        cuisine: selectedCuisine !== 'All' ? selectedCuisine : undefined,
        isVeg: isVegOnly || undefined,
        minRating: minRating > 0 ? minRating : undefined,
        maxDistance: maxDistance < 10 ? maxDistance : undefined,
        availableToday: availableToday || undefined,
      });

      if (res.success) {
        setCooks(res.cooks);
      }
    } catch (err) {
      console.error('Failed to filter cooks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-6 w-full max-w-full overflow-x-hidden">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#F1F8F1] border border-[#DDEEDF] flex items-center justify-center mx-auto text-[#079669] shadow-garden">
          <Utensils className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        
        <div className="max-w-xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] text-[11px] font-extrabold uppercase tracking-wider">
            HOME DELIGHTS • Verified Kitchens
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#123F35] tracking-tight">
            Sign In to Explore Home Cooks & Menus
          </h2>
          <p className="font-handwriting text-2xl sm:text-3xl text-[#075C45]">
            “Cooked with love. Served with warmth.”
          </p>
          <p className="text-xs sm:text-sm text-[#123F35]/75 leading-relaxed font-medium">
            To view neighborhood home kitchens, authentic homemade dishes, customer reviews, and order fresh meals, please sign in to HOME DELIGHTS.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={() => openAuthModal('LOGIN')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#079669] hover:bg-[#075C45] text-[#FFFDF7] font-extrabold text-xs shadow-garden transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Explore
          </button>
          <button
            onClick={() => openAuthModal('REGISTER')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F8F4E8] hover:bg-[#DDEEDF] text-[#075C45] font-extrabold text-xs transition-colors cursor-pointer border border-[#DDEEDF]"
          >
            Create Free Account
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid sm:grid-cols-3 gap-4 pt-8 border-t border-[#DDEEDF] text-left">
          <div className="p-4 rounded-[22px] bg-[#FFFDF7] border border-[#DDEEDF] shadow-garden">
            <h4 className="font-extrabold text-[#123F35] text-xs mb-1 flex items-center gap-1.5">
              <span>🏠</span> 100% Home Cooked
            </h4>
            <p className="text-[11px] text-[#123F35]/70 leading-relaxed font-medium">Prepared in family kitchens with traditional recipes, not commercial cloud kitchens.</p>
          </div>
          <div className="p-4 rounded-[22px] bg-[#FFFDF7] border border-[#DDEEDF] shadow-garden">
            <h4 className="font-extrabold text-[#123F35] text-xs mb-1 flex items-center gap-1.5">
              <span>🔍</span> Hygiene Verified
            </h4>
            <p className="text-[11px] text-[#123F35]/70 leading-relaxed font-medium">Every cook undergoes kitchen video audit and food safety compliance.</p>
          </div>
          <div className="p-4 rounded-[22px] bg-[#FFFDF7] border border-[#DDEEDF] shadow-garden">
            <h4 className="font-extrabold text-[#123F35] text-xs mb-1 flex items-center gap-1.5">
              <span>⚡</span> Fresh On Order
            </h4>
            <p className="text-[11px] text-[#123F35]/70 leading-relaxed font-medium">Made fresh after you order using pure ingredients and clean drinking water.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <p className="font-handwriting text-2xl sm:text-3xl text-[#075C45]">
          “Cooked with love. Served with warmth.”
        </p>
        <h1 className="font-display text-3xl font-extrabold text-[#123F35]">
          HOME DELIGHTS Home Cooks Near You
        </h1>
        <p className="text-xs sm:text-sm text-[#123F35]/75 font-medium">
          Browse verified neighbourhood home kitchens cooking fresh homemade food upon your order in Hyderabad.
        </p>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-[#FFFDF7] rounded-[24px] p-5 border border-[#DDEEDF] shadow-garden space-y-4">
        {/* SEARCH BAR */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#075C45]/60 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search home cook name, dish (Gongura, Biryani, Dosa), or locality..."
            className="w-full pl-12 pr-4 py-3 bg-[#F8F4E8]/70 border border-[#DDEEDF] rounded-2xl text-sm font-medium text-[#123F35] placeholder:text-[#123F35]/50 focus:outline-none focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669]"
          />
        </div>

        {/* CUISINE FILTER CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-[#075C45]/70 uppercase tracking-wider shrink-0 mr-1">
            Cuisine:
          </span>
          {cuisinesList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCuisine === c
                  ? 'bg-[#079669] text-[#FFFDF7] shadow-2xs'
                  : 'bg-[#F1F8F1] text-[#075C45] border border-[#DDEEDF] hover:bg-[#DDEEDF]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* SECONDARY FILTER TOGGLES */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#DDEEDF]/80 text-xs font-semibold">
          <div className="flex flex-wrap items-center gap-3">
            {/* VEG ONLY TOGGLE */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isVegOnly
                  ? 'bg-[#F1F8F1] border-[#079669] text-[#075C45] font-extrabold'
                  : 'bg-[#FFFDF7] border-[#DDEEDF] text-[#123F35] hover:bg-[#F8F4E8]'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isVegOnly ? 'bg-[#079669]' : 'bg-[#DDEEDF]'}`} />
              Vegetarian Only
            </button>

            {/* AVAILABLE TODAY */}
            <button
              onClick={() => setAvailableToday(!availableToday)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                availableToday
                  ? 'bg-[#F1F8F1] border-[#079669] text-[#075C45] font-extrabold'
                  : 'bg-[#FFFDF7] border-[#DDEEDF] text-[#123F35] hover:bg-[#F8F4E8]'
              }`}
            >
              Available Today
            </button>

            {/* MIN RATING FILTER */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-[#DDEEDF] bg-[#FFFDF7] text-[#123F35] focus:outline-none"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>★ 4.5+ Top Rated</option>
              <option value={4.8}>★ 4.8+ Exceptional</option>
            </select>
          </div>

          <div className="text-[#123F35]/75 font-medium">
            Showing <span className="font-extrabold text-[#075C45]">{cooks.length}</span> verified kitchens
          </div>
        </div>
      </div>

      {/* COOKS GRID OR EMPTY STATE */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-[#F1F8F1] border border-[#DDEEDF] rounded-[22px] animate-pulse" />
          ))}
        </div>
      ) : cooks.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-[24px] p-12 text-center border border-[#DDEEDF] shadow-garden max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F1F8F1] border border-[#DDEEDF] flex items-center justify-center mx-auto mb-3 text-[#079669]">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-[#123F35] text-lg mb-1">No home cooks found</h3>
          <p className="text-xs text-[#123F35]/70 mb-4">
            Try adjusting your search query or clear filters to see all available home kitchens nearby.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCuisine('All');
              setIsVegOnly(false);
              setMinRating(0);
              setMaxDistance(10);
              setAvailableToday(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#079669] text-[#FFFDF7] font-bold text-xs hover:bg-[#075C45] transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cooks.map((cook) => (
            <CookCard key={cook.id} cook={cook} />
          ))}
        </div>
      )}
    </div>
  );
};
