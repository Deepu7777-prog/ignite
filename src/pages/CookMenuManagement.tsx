import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Power, Clock, Check, X, Utensils } from 'lucide-react';

export const CookMenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New item form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Lunch');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('25');
  const [dietaryType, setDietaryType] = useState<'VEG' | 'NON_VEG'>('VEG');
  const [image, setImage] = useState('');

  const cookId = 'cook_priya'; // Demo cook

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const res = await api.getMenu(cookId);
      if (res.success) {
        setMenuItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFoodItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    try {
      const res = await api.addMenuItem({
        cookId,
        name,
        description: description || "Fresh home-cooked specialty",
        price: parseFloat(price),
        category,
        prepTimeMinutes: parseInt(prepTimeMinutes) || 25,
        dietaryType,
        image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
      });

      if (res.success) {
        setMenuItems((prev) => [res.item, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
      }
    } catch (err) {
      console.error('Failed to add food item:', err);
      alert('Error adding food item');
    }
  };

  const handleTogglePause = async (item: MenuItem) => {
    try {
      const res = await api.updateMenuItem(item.id, { paused: !item.paused });
      if (res.success) {
        setMenuItems((prev) => prev.map((i) => (i.id === item.id ? res.item : i)));
      }
    } catch (err) {
      console.error('Failed to pause item:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const res = await api.deleteMenuItem(id);
      if (res.success) {
        setMenuItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Cook Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Add, edit, pause, or remove dishes. All changes immediately update on customer profiles!
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Food Item
        </button>
      </div>

      {/* ADD ITEM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" /> Add New Dish to Menu
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFoodItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Telangana Natu Kodi Kura"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe ingredients, spice level, or special preparation..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="180"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Specials">Specials</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dietary Type</label>
                  <select
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value as 'VEG' | 'NON_VEG')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="VEG">VEG (Green Dot)</option>
                    <option value="NON_VEG">NON-VEG (Red Dot)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Unsplash / Direct)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
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
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ITEMS LIST TABLE / CARDS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        ) : menuItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No items in menu yet. Click "Add New Food Item" to create your first dish!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  item.paused ? 'bg-slate-100/70 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">{item.name}</h4>
                      <span className="text-xs font-extrabold text-emerald-700">₹{item.price}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>Prep: {item.prepTimeMinutes}m</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleTogglePause(item)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors ${
                      item.paused
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {item.paused ? 'PAUSED' : 'ACTIVE'}
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
