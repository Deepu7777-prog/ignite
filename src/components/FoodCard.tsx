import React from 'react';
import { MenuItem } from '../types';
import { Clock, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface FoodCardProps {
  item: MenuItem;
  cookId: string;
  cookName: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, cookId, cookName }) => {
  const { addToCart, items } = useCart();
  const { user, openAuthModal } = useAuth();

  const cartQuantity = items.find((i) => i.menuItem.id === item.id)?.quantity || 0;

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal('LOGIN');
      return;
    }
    addToCart(item, cookId, cookName);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* ITEM IMAGE & BADGES */}
        <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {/* DIETARY BADGE */}
          <div className="absolute top-2 left-2">
            {item.dietaryType === 'VEG' ? (
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-extrabold text-emerald-700 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                VEG
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-extrabold text-rose-700 border border-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                NON-VEG
              </span>
            )}
          </div>

          {/* PREP TIME BADGE */}
          <div className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur text-white px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            Prep: {item.prepTimeMinutes}m
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-extrabold text-slate-900 text-base leading-snug">
            {item.name}
          </h4>
          <span className="text-sm font-extrabold text-emerald-700 shrink-0">
            ₹{item.price}
          </span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* FOOTER ACTION */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {item.category}
        </span>

        <button
          onClick={handleAddToCart}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
            cartQuantity > 0
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
          }`}
        >
          {cartQuantity > 0 ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added ({cartQuantity})
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};
