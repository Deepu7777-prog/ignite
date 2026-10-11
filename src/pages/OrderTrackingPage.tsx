import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, Message } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  ChefHat,
  Truck,
  PackageCheck,
  ChevronLeft
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { user, isDemo } = useAuth();

  useEffect(() => {
    if (id) {
      loadOrder(id);
      loadMessages(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const res = await api.getOrderById(orderId);
      if (res.success) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (orderId: string) => {
    try {
      const res = await api.getMessages({ orderId });
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !order) return;

    try {
      const msgRes = await api.sendMessage({
        orderId: order.id,
        senderId: user?.id || (isDemo ? 'usr_customer_demo' : 'guest_customer'),
        receiverId: order.cookId,
        senderName: user?.name || (isDemo ? 'Rahul Sharma' : 'Customer'),
        text: newMessage.trim(),
      });

      if (msgRes.success) {
        setMessages((prev) => [...prev, msgRes.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Fetching order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="font-extrabold text-slate-900 text-lg mb-2">Order Not Found</h2>
        <Link to="/orders" className="text-xs font-bold text-emerald-700 underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: Clock },
    { key: 'ACCEPTED', label: 'Cook Accepted', icon: CheckCircle2 },
    { key: 'PREPARING', label: 'Preparing Fresh', icon: ChefHat },
    { key: 'READY', label: 'Ready for Pickup', icon: PackageCheck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* BACK BUTTON */}
      <Link
        to="/customer-dashboard"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl text-slate-900">
                Order #{order.orderNumber}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From <strong className="text-slate-900">{order.cookName}</strong> • Placed {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-2 border border-emerald-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Message Cook ({messages.length})
          </button>
        </div>

        {/* TRACKING STEPPER PROGRESS BAR */}
        <div className="pt-6 border-t border-slate-100 overflow-x-auto pb-2 scrollbar-none">
          <div className="grid grid-cols-6 gap-2 text-center min-w-[460px] sm:min-w-0">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`block text-[10px] font-extrabold ${
                      isCurrent ? 'text-emerald-700 font-extrabold' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHAT MODAL / DRAWER IF OPEN */}
      {isChatOpen && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Direct Chat with {order.cookName}
            </h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Close
            </button>
          </div>

          <div className="h-60 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {messages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                No messages yet. Send a note to the cook regarding your order!
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[80%] ${
                    m.senderId === user?.id ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400">{m.senderName}</span>
                  <div
                    className={`p-3 rounded-2xl text-xs ${
                      m.senderId === user?.id
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message to cook (e.g., extra spicy please)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* ORDER DETAILS & SUMMARY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
          Order Items & Pricing
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100/60">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-400">{item.quantity}x</span>
                <span className="font-bold text-slate-900">{item.name}</span>
              </div>
              <span className="font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-bold text-slate-900">₹{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Fees</span>
            <span className="font-bold text-slate-900">₹{order.tax}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Paid</span>
            <span className="text-emerald-700">₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* RATE & REVIEW SECTION WHEN ORDER IS DELIVERED */}
      {order.status === 'DELIVERED' && (
        <ReviewSubmissionCard order={order} customerUser={user} isDemo={isDemo} />
      )}
    </div>
  );
};

const ReviewSubmissionCard: React.FC<{ order: Order; customerUser: any; isDemo?: boolean }> = ({ order, customerUser, isDemo }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.addReview({
        orderId: order.id,
        customerId: customerUser?.id || (isDemo ? 'usr_customer_demo' : (order.customerId || 'customer')),
        customerName: customerUser?.name || (isDemo ? 'Rahul Sharma' : 'Customer'),
        cookId: order.cookId,
        rating,
        comment,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setError('Failed to submit review.');
      }
    } catch (err: any) {
      setError(err.message || 'Could not submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="font-extrabold text-emerald-950 text-base">Thank You for Your Review!</h4>
        <p className="text-xs text-emerald-700 font-medium">Your feedback was saved and updated on {order.cookName}'s public kitchen profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
      <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
        ⭐ Rate & Review Your Order from {order.cookName}
      </h3>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Select Star Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                  rating >= star
                    ? 'bg-amber-400 text-slate-950 shadow-xs scale-105'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                ★ {star}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Your Written Review</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about the food taste, packaging, hygiene, and freshness..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting Review...' : 'Submit Verified Review'}
        </button>
      </form>
    </div>
  );
};
