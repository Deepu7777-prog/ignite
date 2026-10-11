import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Heart,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Award,
  Users,
  FileText,
  Settings,
  TrendingUp
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, user } = useAuth();

  // Hide Sidebar completely for unauthenticated visitors
  if (!user) {
    return null;
  }

  const customerLinks = [
    { to: '/customer-dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/explore', label: 'Explore Home Cooks', icon: Utensils },
    { to: '/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/favorites', label: 'Saved Favorites', icon: Heart },
    { to: '/subscriptions', label: 'Meal Subscriptions', icon: Calendar },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  const cookLinks = [
    { to: '/cook-dashboard', label: 'Cook Hub', icon: LayoutDashboard },
    { to: '/cook-menu', label: 'Manage Menu', icon: Utensils },
    { to: '/cook-orders', label: 'Incoming Orders', icon: ShoppingBag },
    { to: '/cook-earnings', label: 'Earnings & Revenue', icon: TrendingUp },
    { to: '/messages', label: 'Customer Chat', icon: MessageSquare },
    { to: '/cook-verification', label: 'Verification Details', icon: ShieldCheck },
  ];

  const adminLinks = [
    { to: '/admin-dashboard', label: 'Marketplace Overview', icon: LayoutDashboard },
    { to: '/admin-verifications', label: 'Pending Kitchens', icon: ShieldCheck },
    { to: '/admin-cooks', label: 'All Verified Cooks', icon: Award },
    { to: '/admin-orders', label: 'All Orders', icon: ShoppingBag },
    { to: '/admin-users', label: 'Users Directory', icon: Users },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'COOK' ? cookLinks : customerLinks;

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4">
      {/* USER PROFILE CARD */}
      <div className="p-3 mb-6 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
          alt={user?.name || "Guest User"}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
        />
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-slate-900 truncate">{user?.name || "Guest User"}</p>
          <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">{user ? role : 'GUEST'}</p>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <div className="space-y-1">
        <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {role} Dashboard
        </p>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
