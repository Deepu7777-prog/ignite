import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Search, CheckCircle2, Clock } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSettlement = async (orderId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'SETTLED' ? 'PENDING_SETTLEMENT' : 'SETTLED';
    setUpdatingId(orderId);
    try {
      const res = await api.updateOrderSettlement(orderId, nextStatus);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, settlementStatus: nextStatus } : o)));
      }
    } catch (err) {
      console.error('Failed to update settlement status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const validPaidOrders = orders.filter(
    (o) => (o.paymentStatus === 'PAID' || o.paymentStatus === 'COD_PENDING') &&
           o.status !== 'CANCELLED' && o.status !== 'PAYMENT_FAILED'
  );

  const totalGrossVolume = validPaidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPlatformFee = Math.round(totalGrossVolume * 0.1);
  const totalCookPayouts = totalGrossVolume - totalPlatformFee;
  const pendingSettlementOrders = validPaidOrders.filter((o) => o.settlementStatus !== 'SETTLED');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchesQuery =
      searchQuery === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.cookName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Marketplace Orders & Payout Settlements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Audit platform transaction flow, track 10% platform commission, and process cook settlements.
          </p>
        </div>
      </div>

      {/* SETTLEMENT FINANCIAL SUMMARY METRICS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Gross Marketplace GMV
          </span>
          <p className="font-display text-3xl font-extrabold text-slate-900">
            ₹{totalGrossVolume}
          </p>
          <span className="text-xs font-semibold text-slate-500">{validPaidOrders.length} valid paid orders</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
            Platform Revenue (10%)
          </span>
          <p className="font-display text-3xl font-extrabold text-emerald-700">
            ₹{totalPlatformFee}
          </p>
          <span className="text-xs font-semibold text-slate-500">Platform commission retained</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
            Cook Net Payout Pool (90%)
          </span>
          <p className="font-display text-3xl font-extrabold text-blue-800">
            ₹{totalCookPayouts}
          </p>
          <span className="text-xs font-semibold text-slate-500">To be settled to home kitchens</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
            Pending Settlements
          </span>
          <p className="font-display text-3xl font-extrabold text-amber-900">
            {pendingSettlementOrders.length}
          </p>
          <span className="text-xs font-semibold text-slate-500">Orders awaiting bank payout</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (#HCF-1001) or Cook Name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {['All', 'PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">No orders match the filter.</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const platformFee = Math.round(ord.total * 0.1);
              const cookNet = ord.total - platformFee;
              const isSettled = ord.settlementStatus === 'SETTLED';

              return (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-4 hover:border-slate-300 transition-all text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">#{ord.orderNumber}</span>
                      <StatusBadge status={ord.status} />
                      <span className="text-[10px] font-extrabold bg-slate-200/70 text-slate-700 px-2.5 py-0.5 rounded-full">
                        {ord.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-700 text-sm">Total: ₹{ord.total}</span>
                        <span className="block text-[10px] text-slate-500 font-medium">
                          10% Fee: ₹{platformFee} | Cook Net: ₹{cookNet}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleSettlement(ord.id, ord.settlementStatus)}
                        disabled={updatingId === ord.id}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1.5 transition-all shadow-xs ${
                          isSettled
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                        }`}
                      >
                        {isSettled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            SETTLED
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            MARK SETTLED
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-slate-600 font-medium">
                    <div>
                      <span>Kitchen: <strong className="text-slate-900">{ord.cookName}</strong></span>
                    </div>
                    <div>
                      <span>Customer Delivery Address: <strong className="text-slate-900">{ord.deliveryAddress.addressLine}</strong></span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium border-t border-slate-200/60 pt-2">
                    Items Purchased: {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
