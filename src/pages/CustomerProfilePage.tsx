import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { api } from '../services/api';
import { supabase } from '../services/supabase';
import { Order } from '../types';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  LogOut,
  Edit2,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user, isDemo, logout } = useAuth();
  const { location } = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(user?.name || '');
  const [phoneInput, setPhoneInput] = useState<string>(user?.phone || '');
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNameInput(user.name);
      setPhoneInput(user.phone || '');
      loadCustomerOrders();
    }
  }, [user?.id, isDemo]);

  const loadCustomerOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const customerId = user.id;
      const res = await api.getOrders({ customerId });
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load profile orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // If real Supabase session, update user metadata
      if (!isDemo && supabase) {
        await supabase.auth.updateUser({
          data: {
            name: nameInput,
            phone: phoneInput
          }
        });
      }

      setSaveMsg("Profile details updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err: any) {
      alert("Failed to update profile: " + (err.message || 'Unknown error'));
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-extrabold text-slate-900 text-xl mb-2">Access Denied</h2>
        <p className="text-xs text-slate-500 mb-6">Please log in to view your profile.</p>
        <Link to="/login" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
          Sign In Now
        </Link>
      </div>
    );
  }

  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 w-full max-w-full overflow-x-hidden">
      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/10 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  isDemo ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isDemo ? 'Demo Customer' : 'Verified Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </p>
              {user.phone && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Update Profile Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        )}

        {saveMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
            {saveMsg}
          </div>
        )}
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Now</p>
          <p className="text-2xl font-extrabold text-emerald-600">{activeOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivered</p>
          <p className="text-2xl font-extrabold text-slate-900">{deliveredOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Locality</p>
          <p className="text-xs font-extrabold text-slate-800 truncate mt-2">{location.split(',')[0]}</p>
        </div>
      </div>

      {/* RECENT ORDERS SHORTCUT */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            Your Recent Orders
          </h2>
          <Link
            to="/orders"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(n => (
              <div key={n} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-500 mb-3">No orders placed under this account yet.</p>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Order from Home Cooks
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <div
                key={order.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Order #{order.orderNumber} • {order.cookName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')} • ₹{order.total}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {order.status}
                  </span>
                  <Link
                    to={`/order-tracking/${order.id}`}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACCOUNT DETAILS & SECURITY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Account Security & Details
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Account Role</p>
            <p className="font-extrabold text-slate-800 mt-0.5">{user.role}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Auth Authority</p>
            <p className="font-extrabold text-slate-800 mt-0.5">
              {isDemo ? 'Local Session Demo' : 'Supabase Authentication'}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Current GPS Locality</p>
            <p className="font-extrabold text-slate-800 mt-0.5">{location}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Account Status</p>
            <p className="font-extrabold text-emerald-700 mt-0.5">Active & Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};
