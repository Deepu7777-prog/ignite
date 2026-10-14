import React, { useState } from 'react';
import { api } from '../services/api';
import { ShieldCheck, CheckCircle2, ArrowRight, Video, FileText, Upload } from 'lucide-react';

export const CookVerificationPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [kitchenName, setKitchenName] = useState('');
  const [address, setAddress] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [cuisines, setCuisines] = useState('Andhra, South Indian');
  const [kitchenPhoto, setKitchenPhoto] = useState('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.submitVerification({
        applicantName,
        phone,
        email,
        kitchenName,
        address,
        experienceYears: parseInt(experienceYears) || 5,
        cuisines: cuisines.split(',').map((c) => c.trim()),
        kitchenPhoto,
        aadhaarNumber,
        fssaiNumber,
      });

      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Error submitting kitchen application.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-slate-900">
          Application Submitted for Inspection!
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          Thank you for applying to list your kitchen on <strong>HOME DELIGHTS</strong>. Your Aadhaar KYC & FSSAI details have been uploaded. Our admin team will schedule a 1-on-1 video call to inspect your home kitchen hygiene before granting the <strong>HOME DELIGHTS Verified Kitchen Badge</strong>.
        </p>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-semibold text-amber-900">
          Status: <strong>PENDING ADMIN VIDEO CALL AUDIT</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          Home Cook Verification & Onboarding
        </span>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Register Your Home Kitchen
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
          Join 200+ verified home cooks in Hyderabad earning directly from their own kitchen.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              1. Personal & Kitchen Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Priya Reddy"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kitchen / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  placeholder="Priya's Home Kitchen"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 11111"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya.reddy@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Address & Locality in Hyderabad *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat 101, Green Meadows, Madhapur, Hyderabad - 500081"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              2. Culinary Experience & Cuisines
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cooking Experience (Years)</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="10"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cuisines (Comma Separated)</label>
                <input
                  type="text"
                  value={cuisines}
                  onChange={(e) => setCuisines(e.target.value)}
                  placeholder="Andhra, South Indian, Biryani"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kitchen Photo URL</label>
              <input
                type="text"
                value={kitchenPhoto}
                onChange={(e) => setKitchenPhoto(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              3. Legal KYC & Verification Documents
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar Card Number *</label>
                <input
                  type="text"
                  required
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="1234-5678-9012"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">FSSAI Registration / License Number *</label>
                <input
                  type="text"
                  required
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                  placeholder="23621003000142"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-6"
          >
            Submit Application for Verification
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
