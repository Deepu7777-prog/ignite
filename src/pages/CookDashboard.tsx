import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Order, MenuItem, CookProfile } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  TrendingUp,
  ShoppingBag,
  Utensils,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Power,
  DollarSign,
  AlertCircle,
  Calendar
} from 'lucide-react';

export const CookDashboard: React.FC = () => {
  const { user, isDemo } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cookProfile, setCookProfile] = useState<CookProfile | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [acceptedMethods, setAcceptedMethods] = useState<string[]>([
    'PHONEPE_UPI',
    'RAZORPAY_GATEWAY',
    'CARD',
    'NETBANKING',
    'COD'
  ]);

  const [payoutForm, setPayoutForm] = useState({
    upiId: isDemo ? 'priya.reddy@ybl' : '',
    bankName: isDemo ? 'HDFC Bank' : '',
    accountNumber: isDemo ? '50100234918231' : '',
    ifscCode: isDemo ? 'HDFC0001245' : '',
    accountHolderName: isDemo ? 'Priya Reddy' : (user?.name || ''),
    payoutMethod: 'DIRECT_UPI' as 'DIRECT_UPI' | 'BANK_TRANSFER' | 'RAZORPAY_ROUTE'
  });
  const [isSavingPayout, setIsSavingPayout] = useState<boolean>(false);
  const [payoutMsg, setPayoutMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCookHubData();
  }, [user?.id, isDemo]);

  const loadCookHubData = async () => {
    try {
      setLoading(true);
      const cookId = isDemo ? 'cook_priya' : (user?.id ? (user.id.startsWith('cook_') ? user.id : `cook_${user.id}`) : 'cook_priya');
      const [cookRes, ordersRes] = await Promise.all([
        api.getCookById(cookId).catch(() => ({ success: false, cook: null })),
        api.getOrders({ cookId }).catch(() => ({ success: false, orders: [] })),
      ]);

      if (cookRes.success && cookRes.cook) {
        setCookProfile(cookRes.cook);
        setIsAvailable(cookRes.cook.availableToday);
        if (cookRes.cook.acceptedPaymentMethods) {
          setAcceptedMethods(cookRes.cook.acceptedPaymentMethods);
        }
        if (cookRes.cook.payoutSettings) {
          setPayoutForm({
            upiId: cookRes.cook.payoutSettings.upiId || (isDemo ? 'priya.reddy@ybl' : ''),
            bankName: cookRes.cook.payoutSettings.bankName || (isDemo ? 'HDFC Bank' : ''),
            accountNumber: cookRes.cook.payoutSettings.accountNumber || (isDemo ? '50100234918231' : ''),
            ifscCode: cookRes.cook.payoutSettings.ifscCode || (isDemo ? 'HDFC0001245' : ''),
            accountHolderName: cookRes.cook.payoutSettings.accountHolderName || (isDemo ? 'Priya Reddy' : (user?.name || '')),
            payoutMethod: cookRes.cook.payoutSettings.payoutMethod || 'DIRECT_UPI'
          });
        }
      }
      if (ordersRes.success) {
        setOrders(ordersRes.orders);
      }
    } catch (err) {
      console.error('Failed to load cook hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPayout(true);
    setPayoutMsg(null);
    try {
      if (cookProfile) {
        const res = await api.updateCookPayoutSettings(cookProfile.id, payoutForm);
        if (res.success) {
          setPayoutMsg("Payout & Settlement Settings saved successfully!");
          setTimeout(() => setPayoutMsg(null), 3000);
        }
      }
    } catch (err: any) {
      alert("Failed to save payout settings.");
    } finally {
      setIsSavingPayout(false);
    }
  };
  const toggleAvailability = async () => {
    if (!cookProfile) return;
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    try {
      await api.updateCookStatus(cookProfile.id, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const togglePaymentMethod = async (method: string) => {
    let updated: string[];
    if (acceptedMethods.includes(method)) {
      if (acceptedMethods.length === 1) {
        alert("You must keep at least one payment method active.");
        return;
      }
      updated = acceptedMethods.filter((m) => m !== method);
    } else {
      updated = [...acceptedMethods, method];
    }
    setAcceptedMethods(updated);
    if (cookProfile) {
      try {
        await api.updateCookPaymentMethods(cookProfile.id, updated);
      } catch (err) {
        console.error('Failed to update payment methods', err);
      }
    }
  };

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      const res = await api.updateOrderStatus(orderId, status);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  // Real Earnings calculations (Counts ONLY paid or valid COD orders; excludes cancelled/unpaid orders)
  const validPaidOrders = orders.filter(
    (o) => (o.paymentStatus === 'PAID' || o.paymentStatus === 'COD_PENDING') &&
           o.status !== 'CANCELLED' && 
           o.status !== 'PAYMENT_FAILED' && 
           o.status !== 'PAYMENT_CANCELLED'
  );

  const totalRevenue = validPaidOrders.reduce((sum, o) => sum + o.total, 0);
  const platformFee = Math.round(totalRevenue * 0.1); // 10% platform fee
  const netEarnings = totalRevenue - platformFee;

  const pendingOrders = orders.filter((o) => o.status === 'PLACED');
  const activePreparingOrders = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING' || o.status === 'READY' || o.status === 'OUT_FOR_DELIVERY');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* KITCHEN BANNER HEADER — FRESH GARDEN HOMEMADE SHOWCASE */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#075C45] via-[#077A58] to-[#079669] text-[#FFFDF7] rounded-[28px] sm:rounded-3xl p-6 sm:p-8 shadow-garden-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-[#CDEEDC]/30">
        {/* Soft Decorative Botanical Glow */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#CDEEDC]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={cookProfile?.photo || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"}
            alt="Kitchen"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#E8D99A] shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {cookProfile?.kitchenName || (isDemo ? "Priya's Home Kitchen" : (user?.name ? `${user.name}'s Kitchen` : "My Home Kitchen"))}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-[#FFFDF7]/20 backdrop-blur text-[#E8D99A] text-[10px] font-black uppercase tracking-wider border border-[#E8D99A]/40">
                🌿 APNA RUCHI VERIFIED
              </span>
            </div>
            <p className="text-xs text-[#F8F4E8]/90 font-medium flex items-center gap-1.5">
              <span>Home Cook: <strong>{cookProfile?.ownerName || (isDemo ? "Priya Reddy" : (user?.name || "Home Cook"))}</strong></span>
              <span>•</span>
              <span>📍 {cookProfile?.location || "Madhapur, Hyderabad"}</span>
            </p>
            <p className="font-handwriting text-xl text-[#CDEEDC] pt-0.5">
              “Cooked with pure spices and mother's love.”
            </p>
          </div>
        </div>

        {/* ONLINE AVAILABILITY TOGGLE & QUICK ACTIONS */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-garden cursor-pointer ${
              isAvailable
                ? 'bg-[#E8D99A] text-[#075C45] hover:bg-[#fff0ba]'
                : 'bg-[#054836] text-[#CDEEDC] border border-[#CDEEDC]/30'
            }`}
          >
            <Power className="w-4 h-4" />
            Kitchen Online: {isAvailable ? 'ACTIVE' : 'OFFLINE'}
          </button>

          <Link
            to="/cook/availability"
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF7]/15 backdrop-blur border border-[#CDEEDC]/40 text-[#FFFDF7] font-extrabold text-xs hover:bg-[#FFFDF7]/25 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#E8D99A]" />
            Working Calendar
          </Link>

          <Link
            to="/cook-menu"
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF7] text-[#075C45] font-extrabold text-xs hover:bg-[#F8F4E8] transition-colors flex items-center gap-1.5 shadow-garden"
          >
            <Plus className="w-4 h-4 text-[#079669]" />
            Manage Menu
          </Link>
        </div>
      </div>

      {/* EARNINGS STATS CARDS — GARDEN FRESH STYLE */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FFFDF7] rounded-[24px] p-6 border border-[#DDEEDF] shadow-garden space-y-2 relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#075C45]/70">
              Total Revenue
            </span>
            <span className="text-lg">💰</span>
          </div>
          <p className="font-display text-3xl font-extrabold text-[#123F35]">
            ₹{totalRevenue}
          </p>
          <span className="text-xs font-semibold text-[#075C45]/80 block">{orders.length} total orders completed</span>
        </div>

        <div className="bg-[#FFFDF7] rounded-[24px] p-6 border border-[#DDEEDF] shadow-garden space-y-2 relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#079669]">
              Net Take-Home Earnings
            </span>
            <span className="text-lg">🌿</span>
          </div>
          <p className="font-display text-3xl font-extrabold text-[#079669]">
            ₹{netEarnings}
          </p>
          <span className="text-xs font-semibold text-[#075C45]/80 block">After 10% platform fee (₹{platformFee})</span>
        </div>

        <div className="bg-[#FFFDF7] rounded-[24px] p-6 border border-[#DDEEDF] shadow-garden space-y-2 relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45309]">
              Pending Orders
            </span>
            <span className="text-lg">🍲</span>
          </div>
          <p className="font-display text-3xl font-extrabold text-[#b45309]">
            {pendingOrders.length}
          </p>
          <span className="text-xs font-semibold text-[#123F35]/70 block">Awaiting cook acceptance</span>
        </div>

        <div className="bg-[#FFFDF7] rounded-[24px] p-6 border border-[#DDEEDF] shadow-garden space-y-2 relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#075C45]">
              Active Cooking Handis
            </span>
            <span className="text-lg">🥘</span>
          </div>
          <p className="font-display text-3xl font-extrabold text-[#075C45]">
            {activePreparingOrders.length}
          </p>
          <span className="text-xs font-semibold text-[#123F35]/70 block">In preparation or out for delivery</span>
        </div>
      </div>

      {/* COOK KITCHEN PAYMENT METHODS PREFERENCES SETTINGS */}
      <div className="bg-[#FFFDF7] rounded-[24px] p-6 border border-[#DDEEDF] shadow-garden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDEEDF]/70 pb-3">
          <div>
            <h2 className="font-display font-extrabold text-lg text-[#123F35] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#079669]" />
              Kitchen Accepted Payment Options
            </h2>
            <p className="text-xs text-[#123F35]/70 font-medium">
              Control which payment options customers can use at checkout for your kitchen.
            </p>
          </div>
          <span className="text-[11px] font-extrabold bg-[#F1F8F1] text-[#075C45] px-3 py-1 rounded-full border border-[#DDEEDF] shrink-0">
            {acceptedMethods.length} Methods Active
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {/* PHONEPE */}
          <button
            type="button"
            onClick={() => togglePaymentMethod('PHONEPE_UPI')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
              acceptedMethods.includes('PHONEPE_UPI')
                ? 'bg-purple-50/70 border-purple-400 text-purple-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div>
              <span className="font-extrabold text-xs block text-slate-900">📱 PhonePe & UPI</span>
              <span className="text-[10px] text-slate-500">PhonePe Direct, GPay, Paytm, Direct UPI</span>
            </div>
            <input
              type="checkbox"
              checked={acceptedMethods.includes('PHONEPE_UPI')}
              readOnly
              className="mt-1 accent-purple-600 w-4 h-4 rounded cursor-pointer"
            />
          </button>

          {/* RAZORPAY */}
          <button
            type="button"
            onClick={() => togglePaymentMethod('RAZORPAY_GATEWAY')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
              acceptedMethods.includes('RAZORPAY_GATEWAY')
                ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div>
              <span className="font-extrabold text-xs block text-slate-900">💳 Razorpay Online Gateway</span>
              <span className="text-[10px] text-slate-500">Instant digital checkout & verification</span>
            </div>
            <input
              type="checkbox"
              checked={acceptedMethods.includes('RAZORPAY_GATEWAY')}
              readOnly
              className="mt-1 accent-emerald-600 w-4 h-4 rounded cursor-pointer"
            />
          </button>

          {/* CARDS */}
          <button
            type="button"
            onClick={() => togglePaymentMethod('CARD')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
              acceptedMethods.includes('CARD')
                ? 'bg-blue-50/70 border-blue-400 text-blue-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div>
              <span className="font-extrabold text-xs block text-slate-900">💳 Credit & Debit Cards</span>
              <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay Cards</span>
            </div>
            <input
              type="checkbox"
              checked={acceptedMethods.includes('CARD')}
              readOnly
              className="mt-1 accent-blue-600 w-4 h-4 rounded cursor-pointer"
            />
          </button>

          {/* NETBANKING */}
          <button
            type="button"
            onClick={() => togglePaymentMethod('NETBANKING')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
              acceptedMethods.includes('NETBANKING')
                ? 'bg-teal-50/70 border-teal-400 text-teal-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div>
              <span className="font-extrabold text-xs block text-slate-900">🏦 Net Banking</span>
              <span className="text-[10px] text-slate-500">HDFC, SBI, ICICI, Axis & 50+ Banks</span>
            </div>
            <input
              type="checkbox"
              checked={acceptedMethods.includes('NETBANKING')}
              readOnly
              className="mt-1 accent-teal-600 w-4 h-4 rounded cursor-pointer"
            />
          </button>

          {/* CASH ON DELIVERY */}
          <button
            type="button"
            onClick={() => togglePaymentMethod('COD')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
              acceptedMethods.includes('COD')
                ? 'bg-amber-50/70 border-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div>
              <span className="font-extrabold text-xs block text-slate-900">💵 Cash on Delivery (COD)</span>
              <span className="text-[10px] text-slate-500">Collect cash upon food delivery</span>
            </div>
            <input
              type="checkbox"
              checked={acceptedMethods.includes('COD')}
              readOnly
              className="mt-1 accent-amber-600 w-4 h-4 rounded cursor-pointer"
            />
          </button>
        </div>
      </div>

      {/* COOK PAYOUT & BANK / UPI SETTLEMENT SETTINGS */}
      <div className="bg-[#FFFDF7] rounded-[24px] p-6 border border-[#DDEEDF] shadow-garden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDEEDF]/70 pb-3">
          <div>
            <h2 className="font-display font-extrabold text-lg text-[#123F35] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#079669]" />
              Payout & Settlement Settings
            </h2>
            <p className="text-xs text-[#123F35]/70 font-medium">
              Configure your bank account or UPI ID to receive weekly direct payouts for your earnings.
            </p>
          </div>
          {payoutMsg && (
            <span className="text-xs font-bold text-[#075C45] bg-[#F1F8F1] px-3 py-1.5 rounded-full border border-[#DDEEDF]">
              {payoutMsg}
            </span>
          )}
        </div>

        <form onSubmit={handleSavePayoutSettings} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#123F35] mb-1">UPI VPA Address (Preferred)</label>
              <input
                type="text"
                value={payoutForm.upiId}
                onChange={(e) => setPayoutForm({ ...payoutForm, upiId: e.target.value })}
                placeholder="e.g. priya.reddy@ybl"
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border border-[#DDEEDF] rounded-xl text-xs font-medium text-[#123F35] focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123F35] mb-1">Payout Method</label>
              <select
                value={payoutForm.payoutMethod}
                onChange={(e) => setPayoutForm({ ...payoutForm, payoutMethod: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border border-[#DDEEDF] rounded-xl text-xs font-medium text-[#123F35] focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
              >
                <option value="DIRECT_UPI">Instant Direct UPI (PhonePe / GPay / Paytm)</option>
                <option value="BANK_TRANSFER">Direct Bank NEFT / IMPS Transfer</option>
                <option value="RAZORPAY_ROUTE">Razorpay Route Automated Settlement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123F35] mb-1">Account Holder Name</label>
              <input
                type="text"
                value={payoutForm.accountHolderName}
                onChange={(e) => setPayoutForm({ ...payoutForm, accountHolderName: e.target.value })}
                placeholder="Name as per Bank Account"
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border border-[#DDEEDF] rounded-xl text-xs font-medium text-[#123F35] focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123F35] mb-1">Bank Name</label>
              <input
                type="text"
                value={payoutForm.bankName}
                onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                placeholder="e.g. HDFC Bank, State Bank of India"
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border border-[#DDEEDF] rounded-xl text-xs font-medium text-[#123F35] focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123F35] mb-1">Account Number</label>
              <input
                type="text"
                value={payoutForm.accountNumber}
                onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                placeholder="Enter 12-16 digit Account Number"
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border border-[#DDEEDF] rounded-xl text-xs font-medium text-[#123F35] focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123F35] mb-1">IFSC Code</label>
              <input
                type="text"
                value={payoutForm.ifscCode}
                onChange={(e) => setPayoutForm({ ...payoutForm, ifscCode: e.target.value.toUpperCase() })}
                placeholder="e.g. HDFC0001245"
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border border-[#DDEEDF] rounded-xl text-xs font-medium text-[#123F35] uppercase focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingPayout}
              className="px-5 py-2.5 bg-[#079669] hover:bg-[#075C45] text-[#FFFDF7] font-extrabold text-xs rounded-xl transition-all shadow-garden disabled:opacity-50 cursor-pointer"
            >
              {isSavingPayout ? 'Saving Payout Settings...' : 'Save Payout Details'}
            </button>
          </div>
        </form>
      </div>

      {/* LIVE ORDERS MANAGEMENT QUEUE */}
      <div className="bg-[#FFFDF7] rounded-[24px] p-6 border border-[#DDEEDF] shadow-garden space-y-6">
        <div className="flex items-center justify-between border-b border-[#DDEEDF]/70 pb-3">
          <h2 className="font-display font-extrabold text-xl text-[#123F35] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#079669]" />
            Live Incoming Orders Queue
          </h2>
          <span className="text-xs font-bold text-[#075C45] bg-[#F1F8F1] px-3 py-1 rounded-full border border-[#DDEEDF]">
            {orders.length} Total Orders
          </span>
        </div>

        {loading ? (
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No orders received yet — your next customer is nearby!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl border border-[#DDEEDF] bg-[#F8F4E8]/50 space-y-4 hover:border-[#079669]/40 transition-all shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDEEDF]/70 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#123F35]">#{ord.orderNumber}</span>
                      <StatusBadge status={ord.status} />
                    </div>
                    <p className="text-xs text-[#123F35]/70 font-medium">
                      Placed by customer on {new Date(ord.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#075C45]">₹{ord.total}</span>
                    <span className="block text-[10px] text-[#075C45]/70 font-semibold">{ord.paymentMethod}</span>
                  </div>
                </div>

                {/* ORDER ITEMS LIST */}
                <div className="space-y-1.5 text-xs text-[#123F35] font-medium">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">🍲</span>
                        <span>{item.quantity}x {item.name}</span>
                      </span>
                      <span className="font-bold text-[#123F35]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* STATUS TRANSITION ACTION BUTTONS FOR COOK */}
                <div className="pt-3 border-t border-[#DDEEDF]/70 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-[#123F35]/70 font-medium">
                    Address: <strong className="text-[#123F35]">{ord.deliveryAddress.addressLine}</strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {ord.status === 'PLACED' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(ord.id, 'ACCEPTED')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(ord.id, 'CANCELLED')}
                          className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {ord.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleStatusUpdate(ord.id, 'PREPARING')}
                        className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-xs"
                      >
                        Start Preparing Fresh
                      </button>
                    )}

                    {ord.status === 'PREPARING' && (
                      <button
                        onClick={() => handleStatusUpdate(ord.id, 'READY')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-xs"
                      >
                        Mark Ready for Delivery
                      </button>
                    )}

                    {ord.status === 'READY' && (
                      <button
                        onClick={() => handleStatusUpdate(ord.id, 'OUT_FOR_DELIVERY')}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
                      >
                        Handover to Courier
                      </button>
                    )}

                    {ord.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleStatusUpdate(ord.id, 'DELIVERED')}
                        className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shadow-xs"
                      >
                        Mark Order Delivered
                      </button>
                    )}

                    {ord.status === 'DELIVERED' && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        Completed & Earnings Credited
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
