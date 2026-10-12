import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import {
  Utensils,
  ShieldCheck,
  Video,
  Clock,
  Sparkles,
  Award,
  MapPin,
  Heart,
  ChevronRight,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { UserRole } from '../types';

export const Footer: React.FC = () => {
  const { switchDemoRole, openAuthModal, user } = useAuth();
  const { location, setLocation, availableLocations } = useLocation();
  const navigate = useNavigate();
  const localitiesScrollRef = useRef<HTMLDivElement>(null);

  const tickerItems = [
    { text: '100% Verified Home Kitchens', icon: ShieldCheck, color: 'text-emerald-400' },
    { text: 'Live Video Call Hygiene Audited', icon: Video, color: 'text-teal-400' },
    { text: 'Freshly Cooked After You Order', icon: Clock, color: 'text-amber-400' },
    { text: 'Zero Preservatives • Pure Desi Ghee', icon: Sparkles, color: 'text-emerald-300' },
    { text: 'Authentic Telugu & South Indian Recipes', icon: Award, color: 'text-yellow-400' },
    { text: 'FSSAI Certified Safety Protocols', icon: ShieldCheck, color: 'text-teal-300' },
    { text: 'Local Doorstep Delivery in Hyderabad', icon: MapPin, color: 'text-emerald-400' },
    { text: 'Made by Mothers & Passioned Home Cooks', icon: Heart, color: 'text-rose-400' },
  ];

  const scrollLocalities = (direction: 'left' | 'right') => {
    if (localitiesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      localitiesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDemoSwitch = async (targetRole: UserRole) => {
    await switchDemoRole(targetRole);
    if (targetRole === 'COOK') navigate('/cook-dashboard');
    else if (targetRole === 'ADMIN') navigate('/admin-dashboard');
    else navigate('/customer-dashboard');
  };

  return (
    <footer className="w-full bg-slate-950 text-white relative overflow-hidden border-t border-slate-800/80">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* --- SCROLLABLE DESIGN #1: INFINITE MARQUEE TICKER RIBBON --- */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 py-3 border-y border-emerald-500/20 overflow-hidden relative shadow-inner">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs font-bold text-slate-200 tracking-wide shadow-sm"
              >
                <Icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SCROLLABLE DESIGN #2: POPULAR NEIGHBOURHOODS HORIZONTAL SCROLL STRIP --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Popular Neighbourhoods in Hyderabad & Secunderabad
            </h4>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scrollLocalities('left')}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scrollLocalities('right')}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* HORIZONTALLY SCROLLABLE LOCALITIES CAROUSEL */}
        <div
          ref={localitiesScrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs"
        >
          {availableLocations.map((loc) => {
            const isCurrent = location.toLowerCase().includes(loc.toLowerCase().split(',')[0]);
            return (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                📍 {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN FOOTER MULTI-COLUMN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* COLUMN 1: BRAND & VISION (2 COLS WIDE ON LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform border border-emerald-500/30">
                <Utensils className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="font-display text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  APNA RUCHI
                </span>
                <span className="block text-[11px] text-emerald-300/80 font-medium -mt-0.5">
                  Ghar Ka Swaad • Real Home Food
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's authentic neighbourhood home kitchen network. Connecting hungry foodies with real neighbourhood mothers and cooks who prepare fresh meals only after you order.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20 w-fit">
              <Video className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>100% Video Call Audited Kitchens</span>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-emerald-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-emerald-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-emerald-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-emerald-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: DISCOVER FOOD */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Homemade Food
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    if (!user) openAuthModal('LOGIN');
                    else navigate('/explore');
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Find Home Cooks
                </button>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-emerald-400 transition-colors">
                  Daily Meal Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/custom-requests" className="hover:text-emerald-400 transition-colors">
                  Custom Party Requests
                </Link>
              </li>
              <li>
                <Link to="/explore?cuisine=Festival Specials" className="hover:text-emerald-400 transition-colors">
                  Festive & Traditional Sweets
                </Link>
              </li>
              <li>
                <Link to="/explore?isVeg=true" className="hover:text-emerald-400 transition-colors">
                  Pure Vegetarian Thalis
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: KITCHEN TRUST & PROTOCOL */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Trust & Hygiene
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/cook-verification" className="hover:text-emerald-400 transition-colors">
                  Video Call Audit Process
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Aadhaar DigiLocker KYC</span>
              </li>
              <li>
                <span className="text-slate-400">FSSAI License Standard</span>
              </li>
              <li>
                <span className="text-slate-400">Monthly Hygiene Re-Checks</span>
              </li>
              <li>
                <Link to="/cook-verification" className="hover:text-emerald-400 transition-colors">
                  Become a Home Cook
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: SUPPORT & ACCESS */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Secunderabad & Hyderabad, Telangana</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+91 84648 26785</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@apnaruchi.in</span>
              </li>
              <li className="pt-2">
                {!user ? (
                  <button
                    onClick={() => openAuthModal('REGISTER')}
                    className="w-full px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Join APNA RUCHI
                  </button>
                ) : (
                  <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Logged in as {user.name}
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR WITH DEMO ACCESS & COPYRIGHT --- */}
      <div className="border-t border-slate-900 bg-slate-950/90 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500 font-medium">
          <div>
            © 2026 APNA RUCHI. Cooked fresh with love. All rights reserved.
          </div>

          {/* ONE-LINE DEMO ACCESS (SEPARATE & ACCESSIBLE) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-bold text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              Demo Access:
            </span>
            <button
              onClick={() => handleDemoSwitch('CUSTOMER')}
              className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
            >
              Customer
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleDemoSwitch('COOK')}
              className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
            >
              Cook / Provider
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleDemoSwitch('ADMIN')}
              className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
