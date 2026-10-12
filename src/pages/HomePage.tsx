import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CookProfile } from '../types';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  Search,
  ArrowRight,
  BadgeCheck,
  Calendar,
  MessageSquareQuote,
  Gift,
  RefreshCw,
  Video,
  Flame,
  Award,
  ChevronRight,
  Navigation,
  Leaf,
  Utensils
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [kitchenCount, setKitchenCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const { location, setLocation, detectLocation, isDetecting, availableLocations, searchLocations, locationError } = useLocation();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadKitchenCount();
  }, []);

  const loadKitchenCount = async () => {
    try {
      const res = await api.getCooks();
      if (res.success && res.cooks) {
        setKitchenCount(res.cooks.length);
      }
    } catch (err) {
      console.error('Failed to load cooks count:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('LOGIN');
      return;
    }
    if (searchQuery.trim()) {
      const matchingLoc = availableLocations.find((l) =>
        l.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingLoc) {
        setLocation(matchingLoc);
      }
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSelectLocation = (locName: string) => {
    setLocation(locName);
    setSearchQuery(locName.split(',')[0]);
    setShowLocationDropdown(false);
  };

  const handleDetectGPS = async () => {
    await detectLocation();
    setShowLocationDropdown(false);
  };

  const matchingLocationSuggestions = searchLocations(searchQuery);

  return (
    <div className="space-y-12 sm:space-y-16 pb-8 sm:pb-12 w-full max-w-full overflow-x-hidden">
      {/* --- HERO SECTION (GREEN + WHITE DECORATIVE STYLE) --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/75 via-white to-emerald-50/35 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-24 border-b border-emerald-100/70 w-full max-w-full">
        {/* Soft Organic Background Accents */}
        <div className="absolute top-0 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT HERO TEXT */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
              {/* KITCHEN COUNT & BOTANICAL HOMEMADE BADGE */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/95 backdrop-blur border border-emerald-200/90 shadow-2xs text-xs font-bold text-slate-800 max-w-full truncate">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                <span className="text-emerald-800 font-extrabold flex items-center gap-1 shrink-0">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  100% Homemade
                </span>
                <span className="text-slate-300 shrink-0">•</span>
                <span className="truncate">{kitchenCount}+ Verified Kitchens</span>
                <span className="text-slate-300 shrink-0">•</span>
                <span className="text-emerald-700 font-extrabold flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {location.split(',')[0]}
                </span>
              </div>

              {/* MAIN TITLE & SUPPORT */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] sm:leading-[1.08]">
                Find Real Home Food <br />
                <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Near You
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover verified local home cooks and fresh homemade meals. Every kitchen is verified on a video call — cooking fresh only after you place your order.
              </p>

              {/* REAL LOCATION-AWARE SEARCH FORM */}
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-slate-200/80 max-w-xl mx-auto lg:mx-0 space-y-3 relative">
                {locationError && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{locationError}</span>
                  </div>
                )}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onFocus={() => setShowLocationDropdown(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowLocationDropdown(true);
                      }}
                      placeholder="Search dishes or locality..."
                      className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search
                  </button>
                </form>

                {/* INTERACTIVE LOCATION SUGGESTIONS DROPDOWN */}
                {showLocationDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLocationDropdown(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 max-h-72 overflow-y-auto">
                      <button
                        onClick={handleDetectGPS}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold hover:bg-emerald-100 transition-colors mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-emerald-600" />
                          {isDetecting ? "Detecting GPS location..." : "Use Current GPS Location"}
                        </span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">GPS</span>
                      </button>

                      <div className="py-1">
                        <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Select Neighbourhood in Hyderabad
                        </p>
                        {matchingLocationSuggestions.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => handleSelectLocation(loc)}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-semibold transition-colors ${
                              location === loc ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {loc}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Select</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* LOCATION BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Active Location:</span>
                    <span className="truncate max-w-[180px] font-bold text-slate-900">{location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDetectGPS}
                      disabled={isDetecting}
                      className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors text-[11px] flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      {isDetecting ? 'Detecting...' : 'Detect GPS'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      openAuthModal('LOGIN');
                    } else {
                      navigate('/explore');
                    }
                  }}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  Find Home Cooks
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/cook-verification"
                  className="px-6 py-3.5 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 text-emerald-800 hover:text-emerald-900 font-extrabold text-sm hover:bg-emerald-50/60 transition-all shadow-2xs"
                >
                  Become a Home Cook
                </Link>
              </div>

              {/* KEY TRUST BULLETS */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-bold text-slate-600 pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  Cooked fresh after order
                </span>
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Live video call verified
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
                  Re-checked every month
                </span>
              </div>
            </div>

            {/* RIGHT HERO PHONE / MOCK CARD DISPLAY */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-slate-900/10">
                  <div className="bg-white rounded-[2rem] overflow-hidden p-4 space-y-3">
                    {/* PHONE HEADER */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          HCF
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Live in {location.split(',')[0]}</p>
                          <p className="text-xs font-extrabold text-slate-900">Cooking Near You Today</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {kitchenCount} Kitchens
                      </span>
                    </div>

                    {/* SAMPLE KITCHEN CARD 1 */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
                      <div className="relative h-28 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
                          alt="Andhra Thali"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          VERIFIED
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900">Priya's Home Kitchen</h4>
                          <p className="text-[10px] text-slate-500">Andhra Special Thali • Madhapur</p>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-700">₹140</span>
                      </div>
                    </div>

                    {/* SAMPLE KITCHEN CARD 2 */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900">Amma's Kitchen</h4>
                          <p className="text-[10px] text-slate-500">Chicken Dum Biryani • Kondapur</p>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-700">₹220</span>
                      </div>
                      <div className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Ready by 1:15 PM • Freshly Prepared
                      </div>
                    </div>
                  </div>
                </div>

                {/* FLOATING VERIFIED BADGE */}
                <div className="absolute -bottom-3 left-2 sm:-left-4 sm:-bottom-4 bg-white rounded-2xl shadow-xl p-3 sm:p-3.5 border border-slate-200 flex items-center gap-2.5 sm:gap-3 max-w-[calc(100%-1rem)]">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Verified Today</p>
                    <p className="text-xs font-extrabold text-slate-900 truncate">100% Home Kitchens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOD CATEGORY INFORMATIONAL CARDS (NON-CLICKABLE AS PER SPEC) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Authentic Regional Specialties
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Popular Homemade Cuisines Near You
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Traditional family recipes cooked fresh in home cookware with pure ingredients and zero commercial preservatives.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* CATEGORY 1: THALIS & MEALS */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs hover:shadow-xs transition-all space-y-3 relative overflow-hidden group">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-2xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                Andhra & Telangana Thalis
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Slow-cooked Pappu, Gongura, Rasam, Sambar, seasonal curries, and freshly tempered dal with hot steamed rice.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100/60">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Pure Desi Ghee
            </div>
          </div>

          {/* CATEGORY 2: FRESH TIFFINS */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs hover:shadow-xs transition-all space-y-3 relative overflow-hidden group">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                Morning & Evening Tiffins
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Stone-ground fermented batter dosas, steaming soft idlis, spicy peanut & ginger chutneys, and hot Upma.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100/60">
              <Clock className="w-3 h-3 text-emerald-600" />
              Fresh Stone-Ground
            </div>
          </div>

          {/* CATEGORY 3: PURE VEGETARIAN */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs hover:shadow-xs transition-all space-y-3 relative overflow-hidden group">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-2xs">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                100% Pure Veg Kitchens
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dedicated vegetarian family kitchens with separate utensils, cold-pressed oils, and zero onion/garlic options.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100/60">
              <BadgeCheck className="w-3 h-3 text-emerald-600" />
              Separate Cookware
            </div>
          </div>

          {/* CATEGORY 4: FESTIVE SWEETS & SNACKS */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs hover:shadow-xs transition-all space-y-3 relative overflow-hidden group">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-2xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                Festive Sweets & Snacks
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Sunnundalu, Bobbatlu, Mysore Pak & Murukku handmade in small family batches observing authentic rituals.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100/60">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Small Batch Made
            </div>
          </div>
        </div>
      </section>

      {/* --- FOUR WAYS TO EAT / ORDER MODES (SECONDARY REFERENCE FEATURE SPEC) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-2">
            Four Ways to Eat
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One verified home kitchen network. <br />
            <span className="text-emerald-600">Every homemade food craving.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* MODE 1: EVERYDAY HOME FOOD */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">
              1. Everyday Home Food
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Order fresh Andhra Thalis, North Indian meals, or Tiffins cooked by verified neighbours only after you place your order.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/70">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Cooked fresh to order
            </div>
          </div>

          {/* MODE 2: CUSTOM FOOD REQUEST */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <MessageSquareQuote className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">
              2. Custom Food Request
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask for anything a home can make! Family function Gongura mutton for 20 people or dietary dishes. Nearby cooks quote prices.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/70">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Direct home cook quotes
            </div>
          </div>

          {/* MODE 3: MEAL SUBSCRIPTIONS */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">
              3. Meal Subscriptions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subscribe to daily, weekly or monthly home food plans. Your lunch auto-arrives from chosen cooks with pause/skip controls.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/70">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Daily scheduled meals
            </div>
          </div>

          {/* MODE 4: FESTIVAL & CHEF SPECIALS */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Gift className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">
              4. Festival & Sweets
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Genuine festive cooking like Ugadi Pachadi, Bobbatlu, Mysurpa & Sunnundalu made in small batches by homes observing the festival.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/70">
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              Authentic small batches
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST MOAT / VERIFICATION PROCESS SECTION (GREEN + WHITE TRUST SPEC) --- */}
      <section className="bg-gradient-to-br from-white via-emerald-50/40 to-white text-slate-900 rounded-3xl max-w-7xl mx-4 sm:mx-auto p-6 sm:p-10 lg:p-12 border border-emerald-200/90 shadow-sm relative overflow-hidden">
        {/* Soft Decorative Organic Shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Live Women-Led Hygiene Verification
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Every home kitchen is verified by women <br />
              <span className="text-emerald-700">on a live video call.</span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Trust is the heartbeat of homemade food. That's why we never rely on self-declarations. Every home cook undergoes a comprehensive 1-on-1 video call kitchen audit, Aadhaar KYC, FSSAI licensing check, and monthly hygiene renewals.
            </p>

            <div className="grid sm:grid-cols-2 gap-3.5 text-xs font-bold text-slate-800 pt-2">
              <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-emerald-100/90 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Live Video Call Hygiene Inspection</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-emerald-100/90 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Aadhaar DigiLocker KYC & FSSAI Registry</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-emerald-100/90 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Safe Food Preparation & Clean Water Audit</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-emerald-100/90 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Re-checked Every Single Month</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100/90 shadow-sm w-full max-w-md space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Verification Certificate</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1 border border-emerald-200">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Active & Verified
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Home Kitchen</span>
                  <span className="font-extrabold text-slate-900">Priya's Home Kitchen</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Live Video Audit</span>
                  <span className="font-extrabold text-emerald-700">Passed (Hygiene Grade A+)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">FSSAI License</span>
                  <span className="font-mono font-bold text-slate-800">23621003000142</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Monthly Renewal</span>
                  <span className="font-extrabold text-emerald-700">Verified This Month</span>
                </div>
              </div>

              <Link
                to="/cook-verification"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm text-center"
              >
                Submit Your Kitchen for Verification
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
