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
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/92 backdrop-blur-md border-b border-[#DDEEDF] shadow-nav">
        {/* MAIN NAVBAR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#075C45] via-[#077A58] to-[#079669] flex items-center justify-center text-[#FFFDF7] shadow-garden group-hover:scale-105 transition-transform duration-300 shrink-0 border border-[#CDEEDC]/40">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8D99A]" />
            </div>
            <div className="leading-tight min-w-0">
              <span className="block font-display text-base sm:text-lg lg:text-xl font-extrabold text-[#075C45] tracking-tight group-hover:text-[#079669] transition-colors truncate">
                APNA RUCHI
              </span>
              <span className="hidden sm:block text-[10.5px] text-[#123F35]/75 font-bold -mt-0.5 tracking-wide">
                Ghar Ka Swaad • Fresh Home Food
              </span>
            </div>
          </Link>

          {/* LOCATION SELECTOR (RESPONSIVE DESKTOP + MOBILE) */}
          <div className="relative">
            {/* Desktop Location Button */}
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8F4E8] hover:bg-[#F1F8F1] border border-[#DDEEDF] text-[#123F35] text-xs font-bold transition-all duration-200 shadow-2xs"
            >
              <MapPin className="w-4 h-4 text-[#079669] shrink-0" />
              <span className="max-w-[150px] truncate">{location}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#075C45]/70" />
            </button>

            {/* Mobile Compact Location Button */}
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F8F4E8] hover:bg-[#F1F8F1] border border-[#DDEEDF] text-[#123F35] text-[11px] font-bold transition-all shadow-2xs max-w-[110px] sm:max-w-[140px] shrink-0"
              title="Change Delivery Locality"
            >
              <MapPin className="w-3 h-3 text-[#079669] shrink-0" />
              <span className="truncate">{location.split(',')[0]}</span>
              <ChevronDown className="w-3 h-3 text-[#075C45]/70 shrink-0" />
            </button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-[#FFFDF7] rounded-3xl shadow-garden-lg border border-[#DDEEDF] p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-[#DDEEDF]/60 space-y-1">
                  <button
                    onClick={() => {
                      setIsLocationOpen(false);
                      setIsMapModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-[#079669] text-[#FFFDF7] text-xs font-extrabold shadow-sm hover:bg-[#075C45] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    📍 Use My Current Location
                  </button>
                </div>
                <div className="py-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold text-[#075C45]/60 uppercase tracking-wider">
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
                        location === loc ? 'bg-[#F1F8F1] text-[#075C45] font-bold border border-[#DDEEDF]' : 'text-[#123F35] hover:bg-[#F8F4E8]'
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
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-[#123F35]">
            {/* PUBLIC NAVIGATION (BEFORE LOGIN) */}
            {!user && (
              <>
                <Link
                  to="/explore"
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/explore' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Find Home Cooks
                </Link>
                <Link
                  to="/cook-verification"
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/cook-verification' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
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
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/explore' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Explore Cooks
                </Link>
                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/orders' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  My Orders
                </Link>
                <Link
                  to="/subscriptions"
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/subscriptions' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Meal Plans
                </Link>
                <Link
                  to="/custom-requests"
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/custom-requests' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Custom Request
                </Link>
                <Link
                  to="/customer-dashboard"
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/customer-dashboard' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  My Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`px-3.5 py-2 rounded-2xl transition-all duration-200 ${
                    routeLocation.pathname === '/profile' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF] font-bold shadow-2xs' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
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
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/cook-dashboard' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  My Kitchen
                </Link>
                <Link
                  to="/cook-orders"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/cook-orders' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Incoming Orders
                </Link>
                <Link
                  to="/cook-menu"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/cook-menu' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Manage Menu
                </Link>
                <Link
                  to="/cook/availability"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/cook/availability' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Working Calendar
                </Link>
                <Link
                  to="/cook-earnings"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/cook-earnings' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Earnings
                </Link>
                <Link
                  to="/messages"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/messages' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
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
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/admin-dashboard' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Admin Portal
                </Link>
                <Link
                  to="/admin-verifications"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/admin-verifications' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  Pending Kitchens
                </Link>
                <Link
                  to="/admin-orders"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/admin-orders' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
                  }`}
                >
                  All Orders
                </Link>
                <Link
                  to="/admin-users"
                  className={`px-3 py-2 rounded-xl transition-all ${
                    routeLocation.pathname === '/admin-users' ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'hover:bg-[#F8F4E8] hover:text-[#075C45]'
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
                className="relative px-2.5 sm:px-3.5 py-2 rounded-2xl bg-[#079669] text-[#FFFDF7] font-bold text-xs shadow-sm hover:bg-[#075C45] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalCount > 0 && (
                  <span className="bg-[#FFFDF7] text-[#075C45] text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            )}

            {/* BECOME A HOME COOK BUTTON (ALLOWED ON PUBLIC LANDING FOR UNREGISTERED OR CUSTOMERS) */}
            {(!user || role === 'CUSTOMER') && (
              <Link
                to="/cook-verification"
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#F1F8F1] text-[#075C45] border border-[#DDEEDF] text-xs font-bold hover:bg-[#DDEEDF]/70 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#079669]" />
                Become a Home Cook
              </Link>
            )}

            {/* AUTH ACTIONS: SIGN IN / REGISTER OR USER PROFILE */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 border-l border-[#DDEEDF] shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-left p-1 rounded-2xl bg-[#F8F4E8] border border-[#DDEEDF] shrink-0">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt={user.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#079669]/25 shrink-0"
                    />
                    <div className="hidden sm:block text-left leading-tight pr-1.5">
                      <span className="block text-xs font-bold text-[#123F35] truncate max-w-[100px]">
                        {user.name}
                      </span>
                      <span className="block text-[10px] text-[#079669] font-extrabold uppercase">
                        {isDemo ? 'DEMO MODE' : user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F8F4E8] hover:bg-[#DDEEDF] border border-[#DDEEDF] text-[#075C45] text-xs font-bold transition-colors shrink-0 cursor-pointer"
                    title="Sign Out from Account"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('LOGIN')}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-[#079669] hover:bg-[#075C45] active:scale-[0.98] text-[#FFFDF7] shadow-sm hover:shadow-md text-xs font-extrabold transition-all shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFFDF7]" />
                  <span className="hidden sm:inline">Sign In / Register</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl text-[#075C45] bg-[#F8F4E8] border border-[#DDEEDF] hover:bg-[#F1F8F1] transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE EXPANDED MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#DDEEDF] bg-[#FFFDF7] px-4 py-4 space-y-3 shadow-garden">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMapModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-[#079669] hover:bg-[#075C45] text-[#FFFDF7] rounded-2xl text-xs font-extrabold shadow-sm transition-colors"
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
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-[#075C45] text-[#FFFDF7] rounded-2xl text-xs font-extrabold shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-[#CDEEDC]" />
                  Sign In / Register
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <Link
                    to="/explore"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-[#F8F4E8] border border-[#DDEEDF] text-[#123F35] hover:bg-[#F1F8F1] text-center"
                  >
                    Find Home Cooks
                  </Link>
                  <Link
                    to="/cook-verification"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] hover:bg-[#DDEEDF] text-center"
                  >
                    Become Cook
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F4E8] border border-[#DDEEDF]">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#079669]/25"
                    />
                    <div>
                      <p className="text-xs font-extrabold text-[#123F35]">{user.name}</p>
                      <p className="text-[10px] text-[#079669] font-bold uppercase">{isDemo ? 'DEMO MODE' : user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="px-3 py-1 rounded-xl bg-[#FFFDF7] border border-[#DDEEDF] text-[#075C45] text-xs font-bold hover:bg-[#F1F8F1]"
                  >
                    Logout
                  </button>
                </div>

                {role === 'CUSTOMER' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <Link
                      to="/explore"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Explore Cooks
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/subscriptions"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Meal Plans
                    </Link>
                    <Link
                      to="/custom-requests"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Custom Request
                    </Link>
                    <Link
                      to="/customer-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] hover:bg-[#DDEEDF] text-center"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
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
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      My Kitchen
                    </Link>
                    <Link
                      to="/cook-orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Incoming Orders
                    </Link>
                    <Link
                      to="/cook-menu"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Manage Menu
                    </Link>
                    <Link
                      to="/cook/availability"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] hover:bg-[#DDEEDF] text-center"
                    >
                      Working Calendar
                    </Link>
                    <Link
                      to="/cook-earnings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Earnings
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
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
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Admin Portal
                    </Link>
                    <Link
                      to="/admin-verifications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      Kitchen Approvals
                    </Link>
                    <Link
                      to="/admin-orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
                    >
                      All Orders
                    </Link>
                    <Link
                      to="/admin-users"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F8F4E8] border border-[#DDEEDF]/70 text-[#123F35] hover:bg-[#F1F8F1] text-center"
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
