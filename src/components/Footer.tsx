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
    <footer className="w-full bg-[#075C45] text-[#FFFDF7] relative overflow-hidden border-t border-[#CDEEDC]/25 z-10">
      {/* SOFT BOTANICAL GLOW ACCENTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#079669]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CDEEDC]/10 rounded-full blur-3xl pointer-events-none" />

      {/* SUBTLE BOTANICAL SILHOUETTES IN FOOTER CORNERS */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        className="w-40 h-40 text-[#CDEEDC]/[0.06] absolute bottom-12 right-6 pointer-events-none"
      >
        <path d="M10 110C15 65 45 25 105 10C95 60 65 95 10 110Z" fill="currentColor" />
      </svg>

      {/* --- SCROLLABLE DESIGN #1: INFINITE MARQUEE TICKER RIBBON --- */}
      <div className="bg-gradient-to-r from-[#054836] via-[#075C45] to-[#054836] py-3 border-b border-[#CDEEDC]/20 overflow-hidden relative">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064A37]/90 border border-[#CDEEDC]/25 text-xs font-bold text-[#F8F4E8] tracking-wide shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-[#CDEEDC] shrink-0" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SCROLLABLE DESIGN #2: POPULAR NEIGHBOURHOODS HORIZONTAL SCROLL STRIP --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#CDEEDC]" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#F8F4E8]">
              Popular Neighbourhoods in Hyderabad & Secunderabad
            </h4>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scrollLocalities('left')}
              className="p-1.5 rounded-lg bg-[#064A37] hover:bg-[#079669] text-[#CDEEDC] hover:text-[#FFFDF7] border border-[#CDEEDC]/20 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scrollLocalities('right')}
              className="p-1.5 rounded-lg bg-[#064A37] hover:bg-[#079669] text-[#CDEEDC] hover:text-[#FFFDF7] border border-[#CDEEDC]/20 transition-colors cursor-pointer"
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
                    ? 'bg-[#CDEEDC] text-[#075C45] shadow-sm ring-1 ring-[#FFFDF7]'
                    : 'bg-[#064A37] text-[#F8F4E8] hover:bg-[#079669] hover:text-[#FFFDF7] border border-[#CDEEDC]/20'
                }`}
              >
                📍 {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN FOOTER MULTI-COLUMN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-[#CDEEDC]/20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* COLUMN 1: BRAND & VISION (2 COLS WIDE ON LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-2xl bg-[#FFFDF7] flex items-center justify-center text-[#075C45] font-black shadow-sm group-hover:scale-105 transition-transform border border-[#CDEEDC]">
                <Utensils className="w-5 h-5 text-[#079669]" />
              </div>
              <div>
                <span className="font-display text-lg font-black tracking-tight text-[#FFFDF7] group-hover:text-[#CDEEDC] transition-colors">
                  APNA RUCHI
                </span>
                <span className="block text-[11px] text-[#CDEEDC] font-semibold -mt-0.5">
                  Ghar Ka Swaad • Real Home Food
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#F8F4E8]/85 leading-relaxed max-w-sm">
              India's authentic neighbourhood home kitchen network. Connecting hungry foodies with real neighbourhood mothers and cooks who prepare fresh meals only after you order.
            </p>

            {/* FINAL BRAND LINE IN HANDWRITTEN / DECORATIVE STYLE */}
            <p className="font-handwriting text-2xl text-[#CDEEDC] pt-1">
              “From our homes to your heart. 🌿”
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#CDEEDC] bg-[#064A37] p-2.5 rounded-xl border border-[#CDEEDC]/25 w-fit">
              <Video className="w-4 h-4 shrink-0 text-[#CDEEDC]" />
              <span>100% Video Call Audited Kitchens</span>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="w-8 h-8 rounded-xl bg-[#064A37] hover:bg-[#079669] border border-[#CDEEDC]/20 flex items-center justify-center text-[#F8F4E8] hover:text-[#FFFDF7] transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-[#064A37] hover:bg-[#079669] border border-[#CDEEDC]/20 flex items-center justify-center text-[#F8F4E8] hover:text-[#FFFDF7] transition-colors" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-[#064A37] hover:bg-[#079669] border border-[#CDEEDC]/20 flex items-center justify-center text-[#F8F4E8] hover:text-[#FFFDF7] transition-colors" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-[#064A37] hover:bg-[#079669] border border-[#CDEEDC]/20 flex items-center justify-center text-[#F8F4E8] hover:text-[#FFFDF7] transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: DISCOVER FOOD */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#CDEEDC]">
              Homemade Food
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F4E8]/85">
              <li>
                <button
                  onClick={() => {
                    if (!user) openAuthModal('LOGIN');
                    else navigate('/explore');
                  }}
                  className="hover:text-[#CDEEDC] transition-colors cursor-pointer text-left"
                >
                  Find Home Cooks
                </button>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-[#CDEEDC] transition-colors">
                  Daily Meal Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/custom-requests" className="hover:text-[#CDEEDC] transition-colors">
                  Custom Party Requests
                </Link>
              </li>
              <li>
                <Link to="/explore?cuisine=Festival Specials" className="hover:text-[#CDEEDC] transition-colors">
                  Festive & Traditional Sweets
                </Link>
              </li>
              <li>
                <Link to="/explore?isVeg=true" className="hover:text-[#CDEEDC] transition-colors">
                  Pure Vegetarian Thalis
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: KITCHEN TRUST & PROTOCOL */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#CDEEDC]">
              Trust & Hygiene
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F4E8]/85">
              <li>
                <Link to="/cook-verification" className="hover:text-[#CDEEDC] transition-colors">
                  Video Call Audit Process
                </Link>
              </li>
              <li>
                <span>Aadhaar DigiLocker KYC</span>
              </li>
              <li>
                <span>FSSAI License Standard</span>
              </li>
              <li>
                <span>Monthly Hygiene Re-Checks</span>
              </li>
              <li>
                <Link to="/cook-verification" className="hover:text-[#CDEEDC] transition-colors">
                  Become a Home Cook
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: SUPPORT & ACCESS */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#CDEEDC]">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F4E8]/85">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#CDEEDC] shrink-0" />
                <span>Secunderabad & Hyderabad, Telangana</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#CDEEDC] shrink-0" />
                <span>+91 84648 26785</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#CDEEDC] shrink-0" />
                <span>support@apnaruchi.in</span>
              </li>
              <li className="pt-2">
                {!user ? (
                  <button
                    onClick={() => openAuthModal('REGISTER')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#079669] hover:bg-[#CDEEDC] text-[#FFFDF7] hover:text-[#075C45] font-extrabold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Join APNA RUCHI
                  </button>
                ) : (
                  <span className="inline-block text-[11px] font-bold text-[#CDEEDC] bg-[#064A37] px-2.5 py-1 rounded-lg border border-[#CDEEDC]/25">
                    Logged in as {user.name}
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR WITH DEMO ACCESS & COPYRIGHT --- */}
      <div className="border-t border-[#CDEEDC]/20 bg-[#054836] py-5 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#F8F4E8]/80 font-medium">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© 2026 APNA RUCHI.</span>
            <span className="text-[#CDEEDC] font-semibold">From our homes to your heart. 🌿</span>
          </div>

          {/* ONE-LINE DEMO ACCESS (SEPARATE & ACCESSIBLE) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-bold text-[#F8F4E8] flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#CDEEDC]" />
              Demo Access:
            </span>
            <button
              onClick={() => handleDemoSwitch('CUSTOMER')}
              className="text-[#CDEEDC] hover:text-[#FFFDF7] font-bold hover:underline cursor-pointer"
            >
              Customer
            </button>
            <span className="text-[#CDEEDC]/40">|</span>
            <button
              onClick={() => handleDemoSwitch('COOK')}
              className="text-[#CDEEDC] hover:text-[#FFFDF7] font-bold hover:underline cursor-pointer"
            >
              Cook / Provider
            </button>
            <span className="text-[#CDEEDC]/40">|</span>
            <button
              onClick={() => handleDemoSwitch('ADMIN')}
              className="text-[#CDEEDC] hover:text-[#FFFDF7] font-bold hover:underline cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
