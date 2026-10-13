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
        <div className="w-full max-w-md bg-[#FFFDF7] shadow-garden-lg flex flex-col justify-between border-l border-[#DDEEDF]">
          {/* HEADER */}
          <div className="p-5 border-b border-[#DDEEDF] flex items-center justify-between bg-[#F8F4E8]/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F1F8F1] border border-[#DDEEDF] text-[#075C45] flex items-center justify-center font-bold shadow-2xs">
                <ShoppingBag className="w-4 h-4 text-[#079669]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-extrabold text-[#123F35] text-base">Your Home Food Cart</h3>
                  <span className="text-sm">🍲</span>
                </div>
                {cookName && <p className="text-xs text-[#075C45] font-semibold">From {cookName} • Cooked Fresh</p>}
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-[#123F35]/60 hover:text-[#123F35] hover:bg-[#DDEEDF]/50 transition-colors cursor-pointer"
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
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-[#DDEEDF] bg-[#F8F4E8]/60 hover:border-[#079669]/40 transition-colors shadow-2xs"
                >
                  <img
                    src={menuItem.image}
                    alt={menuItem.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-[#DDEEDF]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">🍲</span>
                      <h5 className="font-extrabold text-[#123F35] text-xs truncate">{menuItem.name}</h5>
                    </div>
                    <p className="text-xs font-black text-[#075C45] mt-0.5">₹{menuItem.price * quantity}</p>
                    <span className="text-[10px] text-[#123F35]/60">₹{menuItem.price} each • 100% Homemade</span>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 bg-[#FFFDF7] border border-[#DDEEDF] rounded-xl px-2 py-1 shadow-2xs">
                    <button
                      onClick={() => updateQuantity(menuItem.id, -1)}
                      className="text-[#123F35]/70 hover:text-[#075C45] p-0.5 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-[#123F35] min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, 1)}
                      className="text-[#123F35]/70 hover:text-[#075C45] p-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(menuItem.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* FOOTER & BILLING */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#DDEEDF] bg-[#FFFDF7] space-y-3.5">
              {/* FOOD SYMBOL PILLS STRIP */}
              <div className="flex items-center justify-between text-[10px] font-black text-[#075C45] bg-[#F1F8F1] px-3 py-1.5 rounded-xl border border-[#DDEEDF]">
                <span>🍲 Fresh Handi</span>
                <span>•</span>
                <span>🌿 Organic Spices</span>
                <span>•</span>
                <span>🪔 Pure Desi Ghee</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#123F35]/80">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-[#123F35]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Neighbourhood Delivery Fee</span>
                  <span className="font-bold text-[#123F35]">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Taxes (5%)</span>
                  <span className="font-bold text-[#123F35]">₹{tax}</span>
                </div>
                <div className="pt-2 border-t border-[#DDEEDF]/70 flex justify-between text-sm font-extrabold text-[#123F35]">
                  <span>Total Payable</span>
                  <span className="text-[#075C45] text-base font-black">₹{total}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-[#F8F4E8] rounded-xl text-[11px] font-semibold text-[#075C45] border border-[#DDEEDF]">
                <ShieldCheck className="w-4 h-4 text-[#079669] shrink-0" />
                <span>Cooked fresh upon your order. Delivered hot from your neighborhood home.</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#079669] hover:bg-[#075C45] text-[#FFFDF7] font-black text-sm shadow-garden hover:shadow-garden-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout (₹{total})</span>
                <span className="text-base">🌿</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
