import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Award,
  Navigation,
  Leaf,
  Utensils,
  Star,
  HeartHandshake,
  ChefHat
} from 'lucide-react';

const FEATURED_PREVIEW_COOKS = [
  {
    id: 'cook_1',
    kitchenName: "Priya's Home Kitchen",
    ownerName: 'Lakshmi Priya',
    dishName: 'Authentic Andhra Special Thali & Pulihora',
    location: 'Madhapur, Hyderabad',
    distance: '1.4 km',
    price: 140,
    rating: 4.9,
    reviews: 128,
    tags: ['Andhra', 'Pure Desi Ghee', '100% Home Cooked'],
    photo: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'cook_2',
    kitchenName: "Amma's Spice Rasoi",
    ownerName: 'Sujatha Reddy',
    dishName: 'Telangana Handi Chicken & Bagara Rice',
    location: 'Kondapur, Hyderabad',
    distance: '2.1 km',
    price: 220,
    rating: 4.8,
    reviews: 96,
    tags: ['Telangana', 'Freshly Ground Masala', 'Zero Preservatives'],
    photo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'cook_3',
    kitchenName: "Annapurna Pure Veg Home",
    ownerName: 'Meenakshi Iyer',
    dishName: 'Stone-Ground Ghee Roast Dosa & Filter Tiffins',
    location: 'Banjara Hills, Hyderabad',
    distance: '2.8 km',
    price: 110,
    rating: 4.9,
    reviews: 154,
    tags: ['Pure Veg', 'Morning & Evening Tiffins', 'Separate Utensils'],
    photo: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
  },
];

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
    <div className="space-y-14 sm:space-y-20 pb-10 sm:pb-16 w-full max-w-full overflow-x-hidden">
      {/* =====================================================================
          1. HERO SECTION — FRESH GREEN GARDEN + HOMEMADE FOOD
      ===================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F8F1] via-[#F8F4E8] to-[#FFFDF7] pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-[#DDEEDF] w-full max-w-full">
        {/* Soft Green & Warm Gold Botanical Glows */}
        <div className="absolute -top-12 -left-12 w-80 sm:w-96 h-80 sm:h-96 bg-[#CDEEDC]/45 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-12 w-80 sm:w-96 h-80 sm:h-96 bg-[#E8D99A]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#DDEEDF]/50 rounded-full blur-2xl pointer-events-none" />

        {/* Subtle Botanical Corner Silhouettes */}
        <svg
          viewBox="0 0 120 120"
          fill="none"
          className="w-28 h-28 sm:w-40 sm:h-40 text-[#075C45]/[0.06] absolute top-4 left-4 pointer-events-none select-none"
        >
          <path
            d="M10 110C15 65 45 25 105 10C95 60 65 95 10 110Z"
            fill="currentColor"
          />
          <path
            d="M10 110C45 75 75 45 105 10"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          className="w-32 h-32 sm:w-44 sm:h-44 text-[#079669]/[0.06] absolute bottom-4 right-4 pointer-events-none select-none rotate-180"
        >
          <path
            d="M10 110C15 65 45 25 105 10C95 60 65 95 10 110Z"
            fill="currentColor"
          />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT HERO TEXT */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
              {/* KITCHEN COUNT & APNA RUCHI BOTANICAL BADGE */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#FFFDF7]/95 backdrop-blur border border-[#DDEEDF] shadow-garden text-xs font-bold text-[#123F35] max-w-full truncate">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#079669] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#079669]" />
                </span>
                <span className="text-[#075C45] font-extrabold flex items-center gap-1 shrink-0">
                  <Leaf className="w-3.5 h-3.5 text-[#079669]" />
                  APNA RUCHI • 100% Homemade
                </span>
                <span className="text-[#DDEEDF] shrink-0">•</span>
                <span className="truncate">{kitchenCount}+ Verified Kitchens</span>
                <span className="text-[#DDEEDF] shrink-0">•</span>
                <span className="text-[#079669] font-extrabold flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-[#079669]" />
                  {location.split(',')[0]}
                </span>
              </div>

              {/* DECORATIVE HANDWRITTEN QUOTE — HERO */}
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="font-handwriting text-2xl sm:text-3xl text-[#075C45] tracking-wide">
                  “Good food feels like home.”
                </span>
                <Leaf className="w-4 h-4 text-[#079669] animate-float-gentle shrink-0" />
              </div>

              {/* MAIN TITLE & SUPPORT */}
              <div className="relative inline-block">
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123F35] tracking-tight leading-[1.12] sm:leading-[1.08]">
                  Find Real Home Food <br />
                  <span className="bg-gradient-to-r from-[#075C45] via-[#079669] to-[#075C45] bg-clip-text text-transparent">
                    with APNA RUCHI
                  </span>
                </h1>
              </div>

              <p className="text-sm sm:text-lg text-[#123F35]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Discover verified neighbourhood mothers and passionate home cooks in Hyderabad. Freshly cooked with love and pure ingredients only after you order — zero commercial preservatives.
              </p>

              {/* REAL LOCATION-AWARE SEARCH FORM */}
              <div className="bg-[#FFFDF7] p-3 sm:p-3.5 rounded-[22px] shadow-garden border border-[#DDEEDF] max-w-xl mx-auto lg:mx-0 space-y-3 relative">
                {locationError && (
                  <div className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#E8D99A] text-[#075C45] text-xs flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#079669] shrink-0" />
                    <span>{locationError}</span>
                  </div>
                )}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                      className="w-full pl-10 pr-3 py-2.5 bg-[#F8F4E8]/70 border border-[#DDEEDF] rounded-xl text-xs font-medium text-[#123F35] placeholder:text-[#123F35]/50 focus:outline-none focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#079669] text-[#FFFDF7] font-extrabold text-xs hover:bg-[#075C45] shadow-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFDF7] rounded-2xl shadow-garden-lg border border-[#DDEEDF] p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 max-h-72 overflow-y-auto">
                      <button
                        onClick={handleDetectGPS}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F1F8F1] text-[#075C45] font-extrabold hover:bg-[#DDEEDF] transition-colors mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-[#079669]" />
                          {isDetecting ? "Detecting GPS location..." : "Use Current GPS Location"}
                        </span>
                        <span className="text-[10px] bg-[#CDEEDC] text-[#075C45] px-2 py-0.5 rounded-full font-bold">GPS</span>
                      </button>

                      <div className="py-1">
                        <p className="px-3 py-1 text-[10px] font-bold text-[#075C45]/60 uppercase tracking-wider">
                          Select Neighbourhood in Hyderabad
                        </p>
                        {matchingLocationSuggestions.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => handleSelectLocation(loc)}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-semibold transition-colors ${
                              location === loc ? 'bg-[#F1F8F1] text-[#075C45] font-extrabold' : 'text-[#123F35] hover:bg-[#F8F4E8]'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#079669]" />
                              {loc}
                            </span>
                            <span className="text-[10px] text-[#075C45]/60 font-medium">Select</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* LOCATION BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DDEEDF]/70 text-xs">
                  <div className="flex items-center gap-1.5 text-[#123F35]/80 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#079669] shrink-0" />
                    <span>Active Location:</span>
                    <span className="truncate max-w-[180px] font-bold text-[#075C45]">{location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDetectGPS}
                      disabled={isDetecting}
                      className="px-3 py-1 rounded-lg bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] font-bold hover:bg-[#DDEEDF] transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 text-[#079669]" />
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
                  className="px-6 py-3.5 rounded-2xl bg-[#079669] hover:bg-[#075C45] text-[#FFFDF7] font-extrabold text-sm shadow-garden hover:shadow-garden-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  Find Home Cooks
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/cook-verification"
                  className="px-6 py-3.5 rounded-2xl bg-[#FFFDF7] border-2 border-[#DDEEDF] hover:border-[#079669] text-[#075C45] font-extrabold text-sm hover:bg-[#F1F8F1] transition-all shadow-2xs hover:-translate-y-0.5"
                >
                  Become a Home Cook
                </Link>
              </div>

              {/* KEY TRUST BULLETS */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-bold text-[#075C45] pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#079669] shrink-0" />
                  Cooked fresh after order
                </span>
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-[#079669] shrink-0" />
                  Live video call verified
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#079669] shrink-0" />
                  Re-checked every month
                </span>
              </div>
            </div>

            {/* RIGHT HERO PHONE / MOCK CARD DISPLAY */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="bg-[#075C45] rounded-[2.5rem] p-3 shadow-garden-lg ring-1 ring-[#DDEEDF]">
                  <div className="bg-[#FFFDF7] rounded-[2rem] overflow-hidden p-4 space-y-3 border border-[#DDEEDF]">
                    {/* PHONE HEADER */}
                    <div className="flex items-center justify-between border-b border-[#DDEEDF] pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#079669] text-[#FFFDF7] flex items-center justify-center font-black text-xs">
                          AR
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#075C45]/70 uppercase">Live in {location.split(',')[0]}</p>
                          <p className="text-xs font-extrabold text-[#123F35]">Cooking Near You Today</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold bg-[#F1F8F1] text-[#075C45] border border-[#DDEEDF] px-2.5 py-0.5 rounded-full">
                        {kitchenCount} Kitchens
                      </span>
                    </div>

                    {/* SAMPLE KITCHEN CARD 1 */}
                    <div className="bg-[#F8F4E8]/70 rounded-2xl p-3 border border-[#DDEEDF] space-y-2">
                      <div className="relative h-28 rounded-xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
                          alt="Andhra Thali"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-extrabold bg-[#079669] text-[#FFFDF7] px-2.5 py-0.5 rounded-full shadow-xs">
                          VERIFIED
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-[#123F35]">Priya's Home Kitchen</h4>
                          <p className="text-[10px] text-[#123F35]/70">Andhra Special Thali • Madhapur</p>
                        </div>
                        <span className="text-xs font-extrabold text-[#079669]">₹140</span>
                      </div>
                    </div>

                    {/* SAMPLE KITCHEN CARD 2 */}
                    <div className="bg-[#F8F4E8]/70 rounded-2xl p-3 border border-[#DDEEDF] space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-[#123F35]">Amma's Kitchen</h4>
                          <p className="text-[10px] text-[#123F35]/70">Chicken Dum Biryani • Kondapur</p>
                        </div>
                        <span className="text-xs font-extrabold text-[#079669]">₹220</span>
                      </div>
                      <div className="inline-block text-[10px] font-bold text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] px-2 py-0.5 rounded-md">
                        Ready by 1:15 PM • Freshly Prepared
                      </div>
                    </div>
                  </div>
                </div>

                {/* FLOATING VERIFIED BADGE */}
                <div className="absolute -bottom-3 left-2 sm:-left-4 sm:-bottom-4 bg-[#FFFDF7] rounded-2xl shadow-garden-lg p-3 sm:p-3.5 border border-[#DDEEDF] flex items-center gap-2.5 sm:gap-3 max-w-[calc(100%-1rem)]">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F1F8F1] border border-[#CDEEDC] text-[#075C45] flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#079669]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-[#075C45]/70">Verified Today</p>
                    <p className="text-xs font-extrabold text-[#123F35] truncate">100% Home Kitchens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FEATURED HOME COOKS SECTION — WARM IVORY CARDS & HANDWRITTEN QUOTE
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] text-[11px] font-extrabold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-[#079669]" />
            Neighbourhood Home Kitchens
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#123F35] tracking-tight">
            Featured Home Cooks on APNA RUCHI
          </h2>
          {/* DECORATIVE HANDWRITTEN QUOTE */}
          <p className="font-handwriting text-2xl sm:text-3xl text-[#075C45] pt-1">
            “Cooked with love. Served with warmth.”
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PREVIEW_COOKS.map((cook) => (
            <div
              key={cook.id}
              onClick={() => {
                if (!user) {
                  openAuthModal('LOGIN');
                } else {
                  navigate(`/cook/${cook.id}`);
                }
              }}
              className="group bg-[#FFFDF7] rounded-[22px] border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:border-[#079669]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 cursor-pointer relative"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-[#F1F8F1]">
                  <img
                    src={cook.photo}
                    alt={cook.kitchenName}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#075C45]/75 via-transparent to-transparent" />

                  {/* GREEN VERIFIED BADGE */}
                  <div className="absolute top-3.5 left-3.5 bg-[#079669] text-[#FFFDF7] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-[#CDEEDC]/40">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#CDEEDC]" />
                    VERIFIED
                  </div>

                  {/* RATING PILL */}
                  <div className="absolute top-3.5 right-3.5 bg-[#FFFDF7]/95 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-extrabold text-[#075C45] flex items-center gap-1 border border-[#DDEEDF]">
                    <Star className="w-3.5 h-3.5 text-[#D4A838] fill-[#D4A838]" />
                    <span>{cook.rating}</span>
                    <span className="text-[10px] text-[#123F35]/60">({cook.reviews})</span>
                  </div>

                  {/* LOCATION & PRICE OVERLAY */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[#FFFDF7] text-xs font-bold">
                    <span className="flex items-center gap-1 bg-[#123F35]/80 backdrop-blur px-2.5 py-1 rounded-xl border border-[#CDEEDC]/20">
                      <MapPin className="w-3.5 h-3.5 text-[#CDEEDC]" />
                      {cook.location} • {cook.distance}
                    </span>
                    <span className="bg-[#075C45]/95 backdrop-blur px-3 py-1 rounded-xl font-extrabold text-[#FFFDF7] border border-[#CDEEDC]/30">
                      From ₹{cook.price}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[#123F35] group-hover:text-[#079669] transition-colors">
                      {cook.kitchenName}
                    </h3>
                    <p className="text-xs text-[#075C45]/80 font-semibold">
                      By {cook.ownerName} • Signature: {cook.dishName}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cook.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <div className="w-full py-2.5 px-4 rounded-2xl bg-[#F8F4E8] group-hover:bg-[#079669] text-[#075C45] group-hover:text-[#FFFDF7] border border-[#DDEEDF] group-hover:border-[#079669] font-extrabold text-xs flex items-center justify-center gap-2 transition-all">
                  <Utensils className="w-3.5 h-3.5" />
                  {user ? 'View Kitchen & Menu' : 'Sign In to View Menu'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. POPULAR HOMEMADE CUISINES SECTION — SOFT PALE-GREEN CONTAINER
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F1F8F1] rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#DDEEDF] shadow-garden space-y-8 relative overflow-hidden">
          {/* Small Botanical Accents in Corners */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="w-24 h-24 text-[#075C45]/[0.07] absolute top-3 right-3 pointer-events-none"
          >
            <path d="M10 90C20 45 45 20 90 10C80 55 55 80 10 90Z" fill="currentColor" />
          </svg>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="w-24 h-24 text-[#079669]/[0.07] absolute bottom-3 left-3 pointer-events-none rotate-180"
          >
            <path d="M10 90C20 45 45 20 90 10C80 55 55 80 10 90Z" fill="currentColor" />
          </svg>

          <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF7] border border-[#DDEEDF] text-[#075C45] text-[11px] font-extrabold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-[#079669]" />
              Authentic Regional Specialties
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#123F35] tracking-tight">
              Popular Homemade Cuisines on APNA RUCHI
            </h2>
            {/* DECORATIVE HANDWRITTEN QUOTE */}
            <p className="font-handwriting text-2xl sm:text-3xl text-[#075C45]">
              “Every recipe carries a little piece of home.”
            </p>
            <p className="text-xs sm:text-sm text-[#123F35]/75 max-w-lg mx-auto font-medium">
              Traditional family recipes cooked fresh in home cookware with pure ingredients and zero commercial preservatives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {/* CATEGORY 1: THALIS & MEALS */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-5 sm:p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5 text-[#079669]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-[#123F35] group-hover:text-[#079669] transition-colors">
                  Andhra & Telangana Thalis
                </h3>
                <p className="text-xs text-[#123F35]/75 mt-1 leading-relaxed">
                  Slow-cooked Pappu, Gongura, Rasam, Sambar, seasonal curries, and freshly tempered dal with hot steamed rice.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <Sparkles className="w-3 h-3 text-[#079669]" />
                Pure Desi Ghee
              </div>
            </div>

            {/* CATEGORY 2: FRESH TIFFINS */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-5 sm:p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-[#079669]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-[#123F35] group-hover:text-[#079669] transition-colors">
                  Morning & Evening Tiffins
                </h3>
                <p className="text-xs text-[#123F35]/75 mt-1 leading-relaxed">
                  Stone-ground fermented batter dosas, steaming soft idlis, spicy peanut & ginger chutneys, and hot Upma.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <Clock className="w-3 h-3 text-[#079669]" />
                Fresh Stone-Ground
              </div>
            </div>

            {/* CATEGORY 3: PURE VEGETARIAN */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-5 sm:p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5 text-[#079669]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-[#123F35] group-hover:text-[#079669] transition-colors">
                  100% Pure Veg Kitchens
                </h3>
                <p className="text-xs text-[#123F35]/75 mt-1 leading-relaxed">
                  Dedicated vegetarian family kitchens with separate utensils, cold-pressed oils, and zero onion/garlic options.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <BadgeCheck className="w-3 h-3 text-[#079669]" />
                Separate Cookware
              </div>
            </div>

            {/* CATEGORY 4: FESTIVE SWEETS & SNACKS */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-5 sm:p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <Gift className="w-5 h-5 text-[#079669]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-[#123F35] group-hover:text-[#079669] transition-colors">
                  Festive Sweets & Snacks
                </h3>
                <p className="text-xs text-[#123F35]/75 mt-1 leading-relaxed">
                  Sunnundalu, Bobbatlu, Mysore Pak & Murukku handmade in small family batches observing authentic rituals.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <Sparkles className="w-3 h-3 text-[#079669]" />
                Small Batch Made
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FRESH FOOD / FOUR WAYS TO EAT SECTION — SOFT CREAM-TO-GREEN
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#F8F4E8] via-[#FFFDF7] to-[#F1F8F1] rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#DDEEDF] shadow-garden relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#079669] flex items-center justify-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#079669]" />
              Four Ways to Eat
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#123F35] tracking-tight">
              One verified home kitchen network. <br />
              <span className="text-[#075C45]">Every homemade craving on APNA RUCHI.</span>
            </h2>
            {/* DECORATIVE HANDWRITTEN QUOTE */}
            <p className="font-handwriting text-2xl sm:text-3xl text-[#075C45] pt-1">
              “Freshly cooked, just for you.”
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* MODE 1: EVERYDAY HOME FOOD */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6 text-[#079669]" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#123F35]">
                1. Everyday Home Food
              </h3>
              <p className="text-xs text-[#123F35]/75 leading-relaxed font-medium">
                Order fresh Andhra Thalis, North Indian meals, or Tiffins cooked by verified neighbours only after you place your order.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <Leaf className="w-3.5 h-3.5 text-[#079669]" />
                Cooked fresh to order
              </div>
            </div>

            {/* MODE 2: CUSTOM FOOD REQUEST */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <MessageSquareQuote className="w-6 h-6 text-[#079669]" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#123F35]">
                2. Custom Food Request
              </h3>
              <p className="text-xs text-[#123F35]/75 leading-relaxed font-medium">
                Ask for anything a home can make! Family function Gongura mutton for 20 people or dietary dishes. Nearby cooks quote prices.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <Leaf className="w-3.5 h-3.5 text-[#079669]" />
                Direct home cook quotes
              </div>
            </div>

            {/* MODE 3: MEAL SUBSCRIPTIONS */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6 text-[#079669]" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#123F35]">
                3. Meal Subscriptions
              </h3>
              <p className="text-xs text-[#123F35]/75 leading-relaxed font-medium">
                Subscribe to daily, weekly or monthly home food plans. Your lunch auto-arrives from chosen cooks with pause/skip controls.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <Leaf className="w-3.5 h-3.5 text-[#079669]" />
                Daily scheduled meals
              </div>
            </div>

            {/* MODE 4: FESTIVAL & CHEF SPECIALS */}
            <div className="bg-[#FFFDF7] rounded-[22px] p-6 border border-[#DDEEDF] shadow-garden hover:shadow-garden-lg hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold">
                <Gift className="w-6 h-6 text-[#079669]" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#123F35]">
                4. Festival & Sweets
              </h3>
              <p className="text-xs text-[#123F35]/75 leading-relaxed font-medium">
                Genuine festive cooking like Ugadi Pachadi, Bobbatlu, Mysurpa & Sunnundalu made in small batches by homes observing the festival.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#075C45] bg-[#F1F8F1] px-2.5 py-1 rounded-xl border border-[#DDEEDF]">
                <Leaf className="w-3.5 h-3.5 text-[#079669]" />
                Authentic small batches
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. TRUST / VERIFICATION SECTION — 6 PILLARS & HANDWRITTEN QUOTE
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FFFDF7] text-[#123F35] rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#DDEEDF] shadow-garden relative overflow-hidden">
          {/* Soft Decorative Botanical Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#CDEEDC]/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8D99A]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F1F8F1] text-[#075C45] font-extrabold text-xs border border-[#DDEEDF]">
                <ShieldCheck className="w-4 h-4 text-[#079669]" />
                Live Women-Led Hygiene Verification
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#123F35]">
                Every home kitchen is verified by women <br />
                <span className="text-[#079669]">on a live video call.</span>
              </h2>

              {/* DECORATIVE HANDWRITTEN QUOTE */}
              <p className="font-handwriting text-2xl sm:text-3xl text-[#075C45]">
                “Real cooks. Real kitchens. Real food.”
              </p>

              <p className="text-sm text-[#123F35]/80 leading-relaxed max-w-xl font-medium">
                Trust is the heartbeat of homemade food. Every home cook undergoes a comprehensive 1-on-1 video call kitchen audit, Aadhaar KYC, FSSAI licensing check, and monthly hygiene renewals.
              </p>

              {/* 6 TRUST PILLARS */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-bold text-[#123F35] pt-2">
                <div className="flex items-center gap-2.5 bg-[#F8F4E8]/80 p-3 rounded-2xl border border-[#DDEEDF]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F8F1] border border-[#CDEEDC] flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4 h-4 text-[#079669]" />
                  </div>
                  <span>Verified Home Cooks</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#F8F4E8]/80 p-3 rounded-2xl border border-[#DDEEDF]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F8F1] border border-[#CDEEDC] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#079669]" />
                  </div>
                  <span>Freshly Cooked</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#F8F4E8]/80 p-3 rounded-2xl border border-[#DDEEDF]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F8F1] border border-[#CDEEDC] flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4 text-[#079669]" />
                  </div>
                  <span>Live Video Verified</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#F8F4E8]/80 p-3 rounded-2xl border border-[#DDEEDF]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F8F1] border border-[#CDEEDC] flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4 text-[#079669]" />
                  </div>
                  <span>Re-checked Regularly</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#F8F4E8]/80 p-3 rounded-2xl border border-[#DDEEDF]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F8F1] border border-[#CDEEDC] flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#079669]" />
                  </div>
                  <span>Hygienic Preparation</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#F8F4E8]/80 p-3 rounded-2xl border border-[#DDEEDF]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F8F1] border border-[#CDEEDC] flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4 text-[#079669]" />
                  </div>
                  <span>Authentic Homemade Food</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-[#F8F4E8] rounded-3xl p-6 border-2 border-[#DDEEDF] shadow-garden w-full max-w-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#DDEEDF] pb-3">
                  <span className="text-xs font-black uppercase text-[#075C45]/70 tracking-wider">APNA RUCHI Certificate</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F1F8F1] text-[#075C45] text-xs font-extrabold flex items-center gap-1 border border-[#CDEEDC]">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#079669]" />
                    Active & Verified
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#DDEEDF]/60">
                    <span className="text-[#123F35]/70 font-medium">Home Kitchen</span>
                    <span className="font-extrabold text-[#123F35]">Priya's Home Kitchen</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDEEDF]/60">
                    <span className="text-[#123F35]/70 font-medium">Live Video Audit</span>
                    <span className="font-extrabold text-[#079669]">Passed (Hygiene Grade A+)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDEEDF]/60">
                    <span className="text-[#123F35]/70 font-medium">FSSAI License</span>
                    <span className="font-mono font-bold text-[#123F35]">23621003000142</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#123F35]/70 font-medium">Monthly Renewal</span>
                    <span className="font-extrabold text-[#079669]">Verified This Month</span>
                  </div>
                </div>

                <Link
                  to="/cook-verification"
                  className="w-full py-3 rounded-2xl bg-[#079669] hover:bg-[#075C45] text-[#FFFDF7] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm text-center"
                >
                  Submit Your Kitchen for Verification
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. BECOME A HOME COOK CTA SECTION — SOFT GREEN GRADIENT & CREAM CARDS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#F1F8F1] via-[#DDEEDF] to-[#CDEEDC]/70 rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-14 border border-[#DDEEDF] shadow-garden-lg relative overflow-hidden">
          {/* Botanical Corner Accents */}
          <svg
            viewBox="0 0 120 120"
            fill="none"
            className="w-36 h-36 text-[#075C45]/[0.07] absolute -top-4 -right-4 pointer-events-none"
          >
            <path d="M10 110C15 65 45 25 105 10C95 60 65 95 10 110Z" fill="currentColor" />
          </svg>

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF7] border border-[#DDEEDF] text-[#075C45] text-xs font-extrabold">
                <ChefHat className="w-4 h-4 text-[#079669]" />
                Empowering Women & Home Kitchens
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#123F35] tracking-tight">
                Love cooking for your family? <br />
                <span className="text-[#075C45]">Share your homemade recipes with your neighbourhood.</span>
              </h2>

              {/* DECORATIVE HANDWRITTEN QUOTE */}
              <p className="font-handwriting text-2xl sm:text-3xl text-[#075C45]">
                “Your kitchen. Your recipes. Your story.”
              </p>

              <p className="text-xs sm:text-sm text-[#123F35]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Join hundreds of respected home cooks across Hyderabad earning from the comfort of home. You decide your menu, your daily meal limit, and your cooking hours.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/cook-verification"
                  className="px-7 py-3.5 rounded-2xl bg-[#075C45] hover:bg-[#079669] text-[#FFFDF7] font-extrabold text-sm shadow-garden hover:shadow-garden-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                >
                  Become a Home Cook on APNA RUCHI
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* CREAM BENEFIT CARDS */}
            <div className="lg:col-span-5 grid sm:grid-cols-2 gap-4">
              <div className="bg-[#FFFDF7] rounded-[22px] p-5 border border-[#DDEEDF] shadow-garden space-y-2">
                <span className="text-xs font-extrabold text-[#079669] uppercase tracking-wider">Flexible Hours</span>
                <h4 className="font-display font-extrabold text-base text-[#123F35]">Cook on Your Schedule</h4>
                <p className="text-xs text-[#123F35]/75 leading-relaxed">
                  Toggle your kitchen open or closed anytime and set daily meal limits that suit your home routine.
                </p>
              </div>
              <div className="bg-[#F8F4E8] rounded-[22px] p-5 border border-[#DDEEDF] shadow-garden space-y-2">
                <span className="text-xs font-extrabold text-[#079669] uppercase tracking-wider">Direct Earnings</span>
                <h4 className="font-display font-extrabold text-base text-[#123F35]">Weekly Bank Payouts</h4>
                <p className="text-xs text-[#123F35]/75 leading-relaxed">
                  Transparent earnings dashboard with zero hidden onboarding charges and full support for FSSAI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

