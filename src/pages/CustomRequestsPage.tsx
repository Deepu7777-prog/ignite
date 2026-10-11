import React, { useState, useEffect } from 'react';
import { CustomRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquareQuote, Plus, CheckCircle2, Clock, MapPin, X } from 'lucide-react';

export const CustomRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user, role, isDemo } = useAuth();

  // New custom request form
  const [dishName, setDishName] = useState('');
  const [servings, setServings] = useState('15');
  const [preferredDate, setPreferredDate] = useState('2026-10-15');
  const [preferredTime, setPreferredTime] = useState('07:00 PM');
  const [budgetMax, setBudgetMax] = useState('4500');
  const [details, setDetails] = useState('');

  // Cook quote form
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteTime, setQuoteTime] = useState('6:30 PM');
  const [quoteMsg, setQuoteMsg] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomRequests();
      if (res.success) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error('Failed to load custom requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName) return;

    try {
      const res = await api.createCustomRequest({
        customerId: user?.id || (isDemo ? 'usr_customer_demo' : `cust_${Date.now()}`),
        customerName: user?.name || (isDemo ? 'Rahul Sharma' : 'Customer'),
        dishName,
        servings: parseInt(servings) || 10,
        preferredDate,
        preferredTime,
        budgetMax: parseFloat(budgetMax) || 3000,
        location: 'Madhapur, Hyderabad',
        details
      });

      if (res.success) {
        setRequests((prev) => [res.request, ...prev]);
        setIsModalOpen(false);
        setDishName('');
        setDetails('');
      }
    } catch (err) {
      console.error('Failed to create custom request:', err);
    }
  };

  const handleCookSubmitQuote = async (reqId: string) => {
    if (!quotePrice) return;
    try {
      const cookIdentifier = isDemo ? 'cook_priya' : (user?.id ? `cook_${user.id}` : 'cook_priya');
      const cookDisplayName = isDemo ? "Priya's Home Kitchen" : (user?.name ? `${user.name}'s Kitchen` : "Home Kitchen");
      const res = await api.submitQuote(reqId, {
        cookId: cookIdentifier,
        cookName: cookDisplayName,
        price: parseFloat(quotePrice),
        deliveryTime: quoteTime,
        message: quoteMsg || "I can prepare authentic fresh home-cooked food for your event!"
      });

      if (res.success) {
        setRequests((prev) => prev.map((r) => (r.id === reqId ? res.request : r)));
        setActiveReqId(null);
        setQuotePrice('');
        setQuoteMsg('');
      }
    } catch (err) {
      console.error('Failed to submit quote:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Custom Food Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Ask for anything a home can make! Family functions, regional dishes, or custom party orders.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ask for Anything a Home Can Make
        </button>
      </div>

      {/* POST REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-emerald-600" /> Post Custom Food Request
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dish / Feast Name *</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Andhra Gongura Mutton & Ragi Mudde for 20 people"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Servings (People)</label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="20"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Budget (₹)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="5000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Time</label>
                  <input
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    placeholder="07:00 PM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Instructions & Details</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Mention dietary preferences, spice level, or container requirements..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Broadcast Request to Nearby Cooks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUESTS LIST */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {loading ? (
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        ) : requests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No open custom requests. Be the first to post a custom food request!
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {req.status}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">{req.dishName}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Requested by {req.customerName} • {req.servings} Servings • Budget: Max ₹{req.budgetMax}
                    </p>
                  </div>

                  {role === 'COOK' && (
                    <button
                      onClick={() => setActiveReqId(activeReqId === req.id ? null : req.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Send Cook Quote
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">
                  "{req.details}"
                </p>

                {/* COOK QUOTE INLINE FORM */}
                {activeReqId === req.id && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 text-xs">
                    <h4 className="font-extrabold text-emerald-950">Submit Your Kitchen Quote</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={quotePrice}
                        onChange={(e) => setQuotePrice(e.target.value)}
                        placeholder="Quote Price (₹)"
                        className="px-3 py-2 bg-white border border-emerald-300 rounded-xl"
                      />
                      <input
                        type="text"
                        value={quoteTime}
                        onChange={(e) => setQuoteTime(e.target.value)}
                        placeholder="Ready Time (e.g. 6:30 PM)"
                        className="px-3 py-2 bg-white border border-emerald-300 rounded-xl"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={quoteMsg}
                      onChange={(e) => setQuoteMsg(e.target.value)}
                      placeholder="Message to customer about ingredients & preparation..."
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl"
                    />
                    <button
                      onClick={() => handleCookSubmitQuote(req.id)}
                      className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800"
                    >
                      Submit Quote to Customer
                    </button>
                  </div>
                )}

                {/* RECEIVED QUOTES */}
                {req.quotes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <h4 className="text-xs font-extrabold text-slate-900">
                      Quotes Received from Home Cooks ({req.quotes.length}):
                    </h4>
                    {req.quotes.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-extrabold text-slate-900">{q.cookName}</span>
                          <p className="text-slate-600 text-[11px]">"{q.message}"</p>
                          <span className="text-[10px] text-slate-400">Ready by {q.deliveryTime}</span>
                        </div>
                        <span className="font-extrabold text-emerald-700 text-sm">₹{q.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
