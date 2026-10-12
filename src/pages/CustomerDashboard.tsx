import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { Order, Favorite, Subscription, Notification } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  MapPin,
  ShoppingBag,
  Heart,
  Calendar,
  Bell,
  ArrowRight,
  Utensils,
  Clock,
  Sparkles
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, isDemo } = useAuth();
  const { location } = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id, isDemo]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const customerId = user?.id || (isDemo ? 'usr_customer_demo' : '');
      if (!customerId) {
        setOrders([]);
        setFavorites([]);
        setSubscriptions([]);
        setNotifications([]);
        return;
      }
      const [ordersRes, favRes, subRes, notifRes] = await Promise.all([
        api.getOrders({ customerId }),
        api.getFavorites(customerId),
        isDemo ? api.getSubscriptions() : Promise.resolve({ success: true, subscriptions: [] }),
        api.getNotifications(customerId),
      ]);

      if (ordersRes.success) setOrders(ordersRes.orders);
      if (favRes.success) setFavorites(favRes.cooks);
      if (subRes.success) setSubscriptions(subRes.subscriptions);
      if (notifRes.success) setNotifications(notifRes.notifications);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* WELCOME BANNER (GREEN + WHITE DASHBOARD STYLE) */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-200 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> APNA RUCHI • Customer Hub
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
            Current Location: <strong className="text-white">{location}</strong>
          </p>
        </div>

        <Link
          to="/explore"
          className="px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Utensils className="w-4 h-4 text-emerald-700" />
          Order Home Food
        </Link>
      </div>

      {/* ACTIVE ORDERS ALERT BANNER */}
      {activeOrders.length > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
              </span>
              <h3 className="font-extrabold text-emerald-950 text-base">
                Active Order in Progress!
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700">
              {activeOrders.length} Order Active
            </span>
          </div>

          {activeOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Order #{ord.orderNumber} • {ord.cookName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={ord.status} />
                <Link
                  to={`/order-tracking/${ord.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                >
                  Live Track <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECENT ORDERS & SUBSCRIPTIONS GRID */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT 8 COLS: RECENT ORDERS & FAVORITES */}
        <div className="lg:col-span-8 space-y-8">
          {/* RECENT ORDERS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                Recent Orders
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {orders.length} Total Orders
              </span>
            </div>

            {loading ? (
              <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
            ) : orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                You haven't placed an order yet. Explore local home cooks to order fresh food!
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">#{ord.orderNumber}</span>
                        <StatusBadge status={ord.status} />
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-1">{ord.cookName}</p>
                      <p className="text-[11px] text-slate-500">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')} • ₹{ord.total}
                      </p>
                    </div>

                    <Link
                      to={`/order-tracking/${ord.id}`}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-xs transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SAVED FAVORITE COOKS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Saved Favorite Kitchens
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {favorites.length} Favorites
              </span>
            </div>

            {favorites.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No favorite home kitchens saved yet. Click the heart icon on any cook card to save it!
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {favorites.map((cook) => (
                  <Link
                    key={cook.id}
                    to={`/cook/${cook.id}`}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3"
                  >
                    <img
                      src={cook.photo}
                      alt={cook.kitchenName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-xs text-slate-900 truncate">{cook.kitchenName}</h5>
                      <p className="text-[10px] text-slate-500">★ {cook.rating} • {cook.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 4 COLS: SUBSCRIPTIONS & NOTIFICATIONS */}
        <div className="lg:col-span-4 space-y-8">
          {/* SUBSCRIPTIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Active Meal Subscriptions
              </h3>
            </div>

            {subscriptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No active meal plans. Subscribe for daily home lunch auto-deliveries!
              </div>
            ) : (
              subscriptions.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md">
                      {sub.planType} PLAN
                    </span>
                    <span className="text-xs font-bold text-indigo-700">{sub.status}</span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900">{sub.dishName}</h5>
                  <p className="text-[10px] text-slate-600">{sub.kitchenName} • {sub.mealsLeft} Meals Remaining</p>
                  <p className="text-[10px] text-indigo-800 font-semibold">Next Delivery: {sub.nextDeliveryDate}</p>
                </div>
              ))
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Recent Activity Notifications
              </h3>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-xs font-extrabold text-slate-900">{n.title}</p>
                  <p className="text-[11px] text-slate-600">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
