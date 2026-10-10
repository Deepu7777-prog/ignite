import React, { useState, useEffect } from 'react';
import { VerificationApplication } from '../types';
import { api } from '../services/api';
import { ShieldCheck, CheckCircle2, XCircle, FileText, Video, Award, Clock } from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const [applications, setApplications] = useState<VerificationApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const res = await api.getVerifications();
      if (res.success) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Failed to load verification applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessApplication = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.updateVerificationStatus(id, status, `Processed by Admin on ${new Date().toLocaleDateString()}`);
      if (res.success) {
        setApplications((prev) => prev.map((a) => (a.id === id ? res.application : a)));
        setSelectedApp(null);
        alert(`Application ${status === 'APPROVED' ? 'Approved! Cook profile is now publicly live and verified.' : 'Rejected.'}`);
      }
    } catch (err) {
      console.error('Failed to update application:', err);
      alert('Error updating application status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Cook Verification Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Review kitchen photos, Aadhaar KYC, FSSAI numbers, and approve verified home cooks.
          </p>
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {loading ? (
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        ) : applications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No pending cook applications at this time.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.kitchenPhoto}
                      alt={app.kitchenName}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{app.kitchenName}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Applicant: <strong>{app.applicantName}</strong> • Phone: {app.phone} • Email: {app.email}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Address: {app.address}
                      </p>
                    </div>
                  </div>

                  {app.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProcessApplication(app.id, 'APPROVED')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                      </button>

                      <button
                        onClick={() => handleProcessApplication(app.id, 'REJECTED')}
                        className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* DETAILS CHIPS */}
                <div className="grid sm:grid-cols-3 gap-3 p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Aadhaar KYC</span>
                    <span className="font-bold">{app.aadhaarNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">FSSAI License</span>
                    <span className="font-bold">{app.fssaiNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Cuisines Offered</span>
                    <span className="font-bold">{app.cuisines.join(', ')}</span>
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
