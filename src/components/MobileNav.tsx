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
  BarChart3,
  Calendar
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, user } = useAuth();

  // Hide MobileNav completely for unauthenticated visitors
  if (!user) {
    return null;
  }

  const customerTabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const cookTabs = [
    { to: '/cook-dashboard', label: 'Hub', icon: Home },
    { to: '/cook-orders', label: 'Orders', icon: ShoppingBag },
    { to: '/cook-menu', label: 'Menu', icon: Utensils },
    { to: '/cook/availability', label: 'Calendar', icon: Calendar },
    { to: '/messages', label: 'Chat', icon: MessageSquare },
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF7]/95 backdrop-blur border-t border-[#DDEEDF] px-2 py-1 shadow-garden-lg">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-colors ${
                  isActive ? 'text-[#075C45] bg-[#F1F8F1] border border-[#DDEEDF]' : 'text-[#123F35]/65 hover:text-[#075C45]'
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
