import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Compass,
  ShoppingBag,
  MessageSquare,
  User,
  Utensils,
  LayoutDashboard,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role } = useAuth();

  const customerTabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/customer-dashboard', label: 'Profile', icon: User },
  ];

  const cookTabs = [
    { to: '/cook-dashboard', label: 'Home', icon: Home },
    { to: '/cook-orders', label: 'Orders', icon: ShoppingBag },
    { to: '/cook-menu', label: 'Menu', icon: Utensils },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/cook-verification', label: 'Profile', icon: User },
  ];

  const adminTabs = [
    { to: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin-verifications', label: 'Cooks', icon: ShieldCheck },
    { to: '/admin-orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin-reports', label: 'Reports', icon: BarChart3 },
    { to: '/customer-dashboard', label: 'More', icon: User },
  ];

  const tabs = role === 'ADMIN' ? adminTabs : role === 'COOK' ? cookTabs : customerTabs;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-colors ${
                  isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
