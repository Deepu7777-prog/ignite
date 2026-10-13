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
  TrendingUp,
  User
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
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/favorites', label: 'Saved Favorites', icon: Heart },
    { to: '/subscriptions', label: 'Meal Subscriptions', icon: Calendar },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  const cookLinks = [
    { to: '/cook-dashboard', label: 'Cook Hub', icon: LayoutDashboard },
    { to: '/cook-orders', label: 'Incoming Orders', icon: ShoppingBag },
    { to: '/cook-menu', label: 'Manage Menu', icon: Utensils },
    { to: '/cook/availability', label: 'Working Calendar', icon: Calendar },
    { to: '/cook-earnings', label: 'Earnings & Revenue', icon: TrendingUp },
    { to: '/messages', label: 'Customer Chat', icon: MessageSquare },
    { to: '/cook-verification', label: 'Kitchen Profile & KYC', icon: ShieldCheck },
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
    <aside className="w-64 shrink-0 hidden lg:block bg-[#FFFDF7] border-r border-[#DDEEDF] min-h-[calc(100vh-4rem)] p-4 shadow-garden">
      {/* USER PROFILE CARD */}
      <div className="p-3 mb-6 bg-[#F8F4E8] rounded-2xl border border-[#DDEEDF] flex items-center gap-3">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
          alt={user?.name || "Guest User"}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#079669]/25"
        />
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-[#123F35] truncate">{user?.name || "Guest User"}</p>
          <p className="text-[10px] font-semibold text-[#079669] uppercase tracking-wider">{user ? role : 'GUEST'}</p>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <div className="space-y-1">
        <p className="px-3 py-1.5 text-[10px] font-bold text-[#075C45]/60 uppercase tracking-wider">
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
                    ? 'bg-[#F1F8F1] text-[#075C45] border border-[#DDEEDF] shadow-2xs'
                    : 'text-[#123F35]/75 hover:bg-[#F8F4E8] hover:text-[#075C45]'
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
