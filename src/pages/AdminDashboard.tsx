import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminStats } from '../types';
import { api } from '../services/api';
import {
  Users,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [teamEmail, setTeamEmail] = useState('');
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, authRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminAuthorizations()
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (authRes.success) setAuthorizations(authRes.authorizations);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorizeTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamEmail.trim()) return;
    setIsAuthorizing(true);
    setAuthMsg(null);
    try {
      const res = await api.authorizeTeamMember({ email: teamEmail.trim(), grantedBy: 'OWNER_ADMIN' });
      if (res.success) {
        setAuthMsg(res.message);
        setTeamEmail('');
        const freshAuths = await api.getAdminAuthorizations();
        if (freshAuths.success) setAuthorizations(freshAuths.authorizations);
        setTimeout(() => setAuthMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || "Failed to authorize team member.");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await api.toggleAdminAuthorizationStatus(id);
      if (res.success) {
        setAuthorizations(prev => prev.map(a => a.id === id ? res.authorization : a));
      }
    } catch (err: any) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Private Admin Control Portal
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold">
            Home Cook Finder Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Private management portal for application owner & authorized team members.
          </p>
        </div>

        <Link
          to="/admin-verifications"
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          Review Pending Cooks ({stats?.pendingVerifications || 0})
        </Link>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-extrabold text-slate-900">
            ₹{stats?.totalRevenue || 0}
          </p>
          <span className="text-xs font-semibold text-emerald-700">
            Platform Commission (10%): ₹{stats?.platformCommission || 0}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Verified Home Cooks</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-extrabold text-slate-900">
            {stats?.verifiedCooks || 0} / {stats?.totalCooks || 0}
          </p>
          <span className="text-xs font-semibold text-slate-500">Video-call verified kitchens</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending Verifications</span>
            <ShieldCheck className="w-5 h-5 text-amber-500" />
          </div>
          <p className="font-display text-3xl font-extrabold text-amber-900">
            {stats?.pendingVerifications || 0}
          </p>
          <span className="text-xs font-semibold text-slate-500">Requires video call sign-off</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="font-display text-3xl font-extrabold text-indigo-950">
            {stats?.totalOrders || 0}
          </p>
          <span className="text-xs font-semibold text-indigo-700">
            {stats?.activeOrders || 0} Active Orders Right Now
          </span>
        </div>
      </div>

      {/* PRIVATE TEAM ADMIN AUTHORIZATION CONTROL PANEL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Private Team Admin Access Management
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Explicit server-side authorization controls. Public users cannot register as Admin.
            </p>
          </div>
          {authMsg && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              {authMsg}
            </span>
          )}
        </div>

        <form onSubmit={handleAuthorizeTeamMember} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={teamEmail}
            onChange={(e) => setTeamEmail(e.target.value)}
            placeholder="Enter registered team member email address..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <button
            type="submit"
            disabled={isAuthorizing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Authorize Team Admin Access
          </button>
        </form>

        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Authorized Admin Roster ({authorizations.length})
          </span>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {authorizations.map((auth) => {
              const isActive = auth.status === 'ACTIVE';
              return (
                <div
                  key={auth.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                    isActive ? 'bg-indigo-50/60 border-indigo-200' : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 block truncate">{auth.name || auth.email}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{auth.email}</span>
                    <span className={`inline-block mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {auth.status}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(auth.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] shrink-0 transition-colors ${
                      isActive
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {isActive ? 'Disable Access' : 'Enable Access'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ADMIN ACTIONS GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* PENDING APPLICATIONS CARD */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Cook Verification Queue
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {stats?.pendingVerifications || 0} Pending
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Review kitchen application details, Aadhaar KYC documents, FSSAI licenses, and complete the video call hygiene checklist to verify new home cooks.
          </p>

          <Link
            to="/admin-verifications"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            Go to Verification Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* MARKETPLACE INTEGRITY CARD */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Marketplace Integrity & Audits
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Monthly Re-Checks
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Every approved home kitchen is scheduled for automated monthly re-verification. Approved cooks immediately show as "Verified Kitchen" across customer discovery.
          </p>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Next Re-Audit Batch: <strong>In 18 Days</strong></span>
            <span className="text-emerald-700 font-extrabold">100% Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
