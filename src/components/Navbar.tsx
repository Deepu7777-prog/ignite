import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { LocationMapModal } from './LocationMapModal';
import {
  MapPin,
  ShoppingBag,
  User as UserIcon,
  ShieldCheck,
  Search,
  ChevronDown,
  Menu,
  X,
  Utensils,
  Sparkles,
  Heart,
  Calendar,
  MessageSquare,
  Navigation,
  LogIn
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { role, switchDemoRole, user, logout, isDemo, openAuthModal } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { location, setLocation, detectLocation, isDetecting, availableLocations } = useLocation();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();

  const handleRoleChange = (newRole: UserRole) => {
    switchDemoRole(newRole);
    if (newRole === 'COOK') {
      navigate('/cook-dashboard');
    } else if (newRole === 'ADMIN') {
      navigate('/admin-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#ebdcc7]/60 shadow-soft">
        {/* MAIN NAVBAR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0 border border-emerald-500/30">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
            </div>
            <div className="leading-tight min-w-0">
              <span className="block font-display text-base sm:text-lg lg:text-xl font-extrabold text-[#113923] tracking-tight group-hover:text-emerald-700 transition-colors truncate">
                APNA RUCHI
              </span>
              <span className="hidden sm:block text-[10.5px] text-[#2d6a4f] font-bold -mt-0.5 tracking-wide">
                Ghar Ka Swaad • Fresh Home Food
              </span>
            </div>
          </Link>

          {/* LOCATION SELECTOR */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#fbf8f1] hover:bg-[#f5eee2] border border-[#ebdcc7] text-[#1b4332] text-xs font-bold transition-colors shadow-2xs"
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="max-w-[150px] truncate">{location}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setIsLocationOpen(false);
                      setIsMapModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    📍 Use My Current Location
                  </button>
                </div>
                <div className="py-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Popular Neighbourhoods
                  </p>
                  {availableLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors ${
                        location === loc ? 'bg-slate-100 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            {/* PUBLIC NAVIGATION (BEFORE LOGIN) */}
            {!user && (
              <>
                <Link
                  to="/explore"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/explore' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Find Home Cooks
                </Link>
                <Link
                  to="/cook-verification"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/cook-verification' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Become a Home Cook
                </Link>
              </>
            )}

            {/* CUSTOMER NAVIGATION (AFTER REAL CUSTOMER LOGIN) */}
            {user && role === 'CUSTOMER' && (
              <>
                <Link
                  to="/explore"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/explore' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Explore Cooks
                </Link>
                <Link
                  to="/orders"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/orders' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  My Orders
                </Link>
                <Link
                  to="/subscriptions"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/subscriptions' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Meal Plans
                </Link>
                <Link
                  to="/custom-requests"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/custom-requests' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Custom Request
                </Link>
                <Link
                  to="/customer-dashboard"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/customer-dashboard' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  My Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/profile' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  My Profile
                </Link>
              </>
            )}

            {/* COOK NAVIGATION (AFTER COOK LOGIN) */}
            {user && role === 'COOK' && (
              <>
                <Link
                  to="/cook-dashboard"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/cook-dashboard' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Cook Hub
                </Link>
                <Link
                  to="/cook-orders"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/cook-orders' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Incoming Orders
                </Link>
                <Link
                  to="/cook-menu"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/cook-menu' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Manage Menu
                </Link>
                <Link
                  to="/cook/availability"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/cook/availability' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Working Calendar
                </Link>
                <Link
                  to="/cook-earnings"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/cook-earnings' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Earnings
                </Link>
                <Link
                  to="/messages"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/messages' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Customer Chat
                </Link>
              </>
            )}

            {/* ADMIN NAVIGATION (AFTER AUTHORIZED ADMIN LOGIN) */}
            {user && role === 'ADMIN' && (
              <>
                <Link
                  to="/admin-dashboard"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/admin-dashboard' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Admin Portal
                </Link>
                <Link
                  to="/admin-verifications"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/admin-verifications' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Pending Kitchens
                </Link>
                <Link
                  to="/admin-orders"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/admin-orders' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  All Orders
                </Link>
                <Link
                  to="/admin-users"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    routeLocation.pathname === '/admin-users' ? 'text-emerald-700 bg-emerald-50' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Users Directory
                </Link>
              </>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* CART BUTTON (ONLY DISPLAYED TO AUTHENTICATED CUSTOMERS) */}
            {user && role === 'CUSTOMER' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-1.5 shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalCount > 0 && (
                  <span className="bg-white text-emerald-700 text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            )}

            {/* BECOME A HOME COOK BUTTON (ALLOWED ON PUBLIC LANDING FOR UNREGISTERED OR CUSTOMERS) */}
            {(!user || role === 'CUSTOMER') && (
              <Link
                to="/cook-verification"
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100/80 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Become a Home Cook
              </Link>
            )}

            {/* AUTH ACTIONS: SIGN IN / REGISTER OR USER PROFILE */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 border-l border-slate-200 shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-left p-1 rounded-xl bg-slate-50 border border-slate-200/60 shrink-0">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt={user.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                    />
                    <div className="hidden sm:block text-left leading-tight pr-1">
                      <span className="block text-xs font-bold text-slate-900 truncate max-w-[100px]">
                        {user.name}
                      </span>
                      <span className="block text-[10px] text-emerald-700 font-extrabold uppercase">
                        {isDemo ? 'DEMO MODE' : user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
                    title="Sign Out from Account"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('LOGIN')}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-2xs hover:shadow-xs text-xs font-extrabold transition-all shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  <span className="hidden sm:inline">Sign In / Register</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE EXPANDED MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMapModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-emerald-600 text-white rounded-xl text-xs font-extrabold shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              📍 Use My Current Location
            </button>

            {!user ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('LOGIN');
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  Sign In / Register
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <Link
                    to="/explore"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                  >
                    Find Home Cooks
                  </Link>
                  <Link
                    to="/cook-verification"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-center"
                  >
                    Become Cook
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-emerald-700 font-bold uppercase">{isDemo ? 'DEMO MODE' : user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>

                {role === 'CUSTOMER' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <Link
                      to="/explore"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Explore Cooks
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/subscriptions"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Meal Plans
                    </Link>
                    <Link
                      to="/custom-requests"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Custom Request
                    </Link>
                    <Link
                      to="/customer-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-center"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Saved Favorites
                    </Link>
                  </div>
                )}

                {role === 'COOK' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <Link
                      to="/cook-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Cook Hub
                    </Link>
                    <Link
                      to="/cook-orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Incoming Orders
                    </Link>
                    <Link
                      to="/cook-menu"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Manage Menu
                    </Link>
                    <Link
                      to="/cook/availability"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-center"
                    >
                      Working Calendar
                    </Link>
                    <Link
                      to="/cook-earnings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Earnings
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Customer Chat
                    </Link>
                  </div>
                )}

                {role === 'ADMIN' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Admin Portal
                    </Link>
                    <Link
                      to="/admin-verifications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      Kitchen Approvals
                    </Link>
                    <Link
                      to="/admin-orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      All Orders
                    </Link>
                    <Link
                      to="/admin-users"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 text-center"
                    >
                      User Directory
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* GPS MAP MODAL */}
      <LocationMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </>
  );
};
