import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const cookName = items.length > 0 ? items[0].cookName : '';

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* BACKDROP */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* HEADER */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base">Your Cart</h3>
                {cookName && <p className="text-xs text-slate-500 font-medium">Ordering from {cookName}</p>}
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CART ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base mb-1">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                  Browse verified home cooks around you and add freshly cooked homemade meals!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/explore');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Explore Home Cooks
                </button>
              </div>
            ) : (
              items.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50"
                >
                  <img
                    src={menuItem.image}
                    alt={menuItem.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-slate-900 text-xs truncate">{menuItem.name}</h5>
                    <p className="text-xs font-extrabold text-emerald-700 mt-0.5">₹{menuItem.price * quantity}</p>
                    <span className="text-[10px] text-slate-400">₹{menuItem.price} each</span>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateQuantity(menuItem.id, -1)}
                      className="text-slate-500 hover:text-slate-900 p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-extrabold text-slate-900 min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, 1)}
                      className="text-slate-500 hover:text-slate-900 p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(menuItem.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* FOOTER & BILLING */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Neighbourhood Delivery Fee</span>
                  <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Taxes (5%)</span>
                  <span className="font-bold text-slate-900">₹{tax}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>To Pay</span>
                  <span className="text-emerald-700">₹{total}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cooked fresh upon your order. Delivered hot from your local neighborhood home.</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout (₹{total})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
