import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CookProfile } from '../types';
import { api } from '../services/api';
import { CookCard } from '../components/CookCard';
import { Search, Filter, MapPin, Star, Utensils, Check } from 'lucide-react';

export const ExplorePage: React.FC = () => {
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
    loadCooks();
  }, [search, selectedCuisine, isVegOnly, minRating, maxDistance, availableToday]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Home Cooks Near You
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Browse verified home kitchens cooking fresh homemade food upon your order in Hyderabad.
        </p>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* SEARCH BAR */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search home cook name, dish (Gongura, Biryani, Dosa), or locality..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* CUISINE FILTER CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Cuisine:
          </span>
          {cuisinesList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCuisine === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* SECONDARY FILTER TOGGLES */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs font-semibold">
          <div className="flex flex-wrap items-center gap-3">
            {/* VEG ONLY TOGGLE */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                isVegOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isVegOnly ? 'bg-emerald-600' : 'bg-slate-300'}`} />
              Vegetarian Only
            </button>

            {/* AVAILABLE TODAY */}
            <button
              onClick={() => setAvailableToday(!availableToday)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                availableToday
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Available Today
            </button>

            {/* MIN RATING FILTER */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>★ 4.5+ Top Rated</option>
              <option value={4.8}>★ 4.8+ Exceptional</option>
            </select>
          </div>

          <div className="text-slate-500 font-medium">
            Showing <span className="font-extrabold text-slate-900">{cooks.length}</span> verified kitchens
          </div>
        </div>
      </div>

      {/* COOKS GRID OR EMPTY STATE */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : cooks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg mb-1">No home cooks found</h3>
          <p className="text-xs text-slate-500 mb-4">
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
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
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
