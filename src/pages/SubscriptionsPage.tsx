import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { api } from '../services/api';
import { Calendar, CheckCircle2, Pause, Play, Plus, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isDemo } = useAuth();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.getSubscriptions();
      if (res.success) {
        setSubscriptions(res.subscriptions);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await api.updateSubscriptionStatus(id, newStatus);
      if (res.success) {
        setSubscriptions((prev) => prev.map((s) => (s.id === id ? res.subscription : s)));
      }
    } catch (err) {
      console.error('Failed to update subscription:', err);
    }
  };

  const handleCreateNewSubscription = async () => {
    try {
      const res = await api.createSubscription({
        customerId: user?.id || (isDemo ? 'usr_customer_demo' : `cust_${Date.now()}`),
        cookId: 'cook_priya',
        kitchenName: "Priya's Home Kitchen",
        planType: 'WEEKLY',
        dishName: 'Andhra Special Meal Thali (Mon-Fri Lunch)',
        daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        mealsLeft: 14,
        pricePerMeal: 130
      });

      if (res.success) {
        setSubscriptions((prev) => [res.subscription, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create subscription:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Home Food Meal Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Subscribe once. Your fresh home lunch auto-arrives from chosen cooks with pause/skip controls.
          </p>
        </div>

        <button
          onClick={handleCreateNewSubscription}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Subscribe New Meal Plan
        </button>
      </div>

      {/* PLANS DISPLAY */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {loading ? (
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        ) : subscriptions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No active meal subscriptions. Click "Subscribe New Meal Plan" to get started!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-6 rounded-3xl border border-slate-200 bg-slate-50/60 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full border border-indigo-200">
                    {sub.planType} PLAN
                  </span>
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{sub.dishName}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Prepared by {sub.kitchenName} • ₹{sub.pricePerMeal} / Meal
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Next Delivery: <strong>{sub.nextDeliveryDate}</strong></span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    {sub.mealsLeft} Meals Remaining
                  </span>

                  <button
                    onClick={() => handleToggleStatus(sub.id, sub.status)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                      sub.status === 'ACTIVE'
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {sub.status === 'ACTIVE' ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pause Subscription
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Resume Plan
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
