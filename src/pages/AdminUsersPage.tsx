import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';
import { Users, ShieldCheck, Award, Search, User as UserIcon } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [counts, setCounts] = useState({ total: 0, customers: 0, cooks: 0, admins: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadUsersDirectory();
  }, []);

  const loadUsersDirectory = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminUsers();
      if (res.success) {
        setUsers(res.users);
        setCounts(res.counts);
      }
    } catch (err) {
      console.error("Failed to load users directory:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      (u.phone && u.phone.includes(q));

    return matchesRole && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          All Users Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Marketplace administration directory of all registered customers, home cooks, and admin accounts.
        </p>
      </div>

      {/* OVERVIEW STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedRoleFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedRoleFilter === 'ALL' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-70">Total Users</span>
          <span className="text-2xl font-black">{counts.total}</span>
        </button>

        <button
          onClick={() => setSelectedRoleFilter('CUSTOMER')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedRoleFilter === 'CUSTOMER' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-70">Customers</span>
          <span className="text-2xl font-black">{counts.customers}</span>
        </button>

        <button
          onClick={() => setSelectedRoleFilter('COOK')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedRoleFilter === 'COOK' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-70">Home Cooks</span>
          <span className="text-2xl font-black">{counts.cooks}</span>
        </button>

        <button
          onClick={() => setSelectedRoleFilter('ADMIN')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedRoleFilter === 'ADMIN' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-70">Admins</span>
          <span className="text-2xl font-black">{counts.admins}</span>
        </button>
      </div>

      {/* SEARCH BAR & FILTER TABS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto overflow-x-auto">
            {['ALL', 'CUSTOMER', 'COOK', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                  selectedRoleFilter === r
                    ? 'bg-slate-900 text-white font-extrabold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* USERS LIST DIRECTORY */}
        {loading ? (
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No users found matching your search filter.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredUsers.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block">{u.name}</span>
                    <span className="text-slate-500 text-[11px] block">{u.email} • {u.phone || 'No phone'}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                  u.role === 'ADMIN' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : u.role === 'COOK' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
