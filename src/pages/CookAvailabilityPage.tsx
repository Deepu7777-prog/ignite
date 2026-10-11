import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CookProfile, CookAvailabilitySlot } from '../types';
import { api } from '../services/api';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Save,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';

export const CookAvailabilityPage: React.FC = () => {
  const { user, isDemo } = useAuth();
  const [cookProfile, setCookProfile] = useState<CookProfile | null>(null);
  const [schedule, setSchedule] = useState<CookAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAvailabilityData();
  }, [user?.id, isDemo]);

  const loadAvailabilityData = async () => {
    try {
      setLoading(true);
      const cookId = isDemo ? 'cook_priya' : (user?.id ? (user.id.startsWith('cook_') ? user.id : `cook_${user.id}`) : 'cook_priya');
      
      const [cookRes, availRes] = await Promise.all([
        api.getCookById(cookId).catch(() => ({ success: false, cook: null })),
        api.getCookAvailability(cookId).catch(() => ({ success: false, schedule: [] }))
      ]);

      if (cookRes.success && cookRes.cook) {
        setCookProfile(cookRes.cook);
      }

      if (availRes.success && availRes.schedule && availRes.schedule.length > 0) {
        setSchedule(availRes.schedule);
      } else {
        // Generate initial 7-day schedule
        generateDefaultSchedule(cookId);
      }
    } catch (err) {
      console.error('Failed to load cook availability:', err);
      setErrorMsg("Failed to load availability schedule.");
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultSchedule = (cookId: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const defaultSlots: CookAvailabilitySlot[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      defaultSlots.push({
        id: `slot_${cookId}_${dateStr}`,
        date: dateStr,
        dayName,
        isAvailable: i < 6, // Mon-Sat available by default
        startTime: '10:00 AM',
        endTime: '02:00 PM',
        notes: i === 6 ? 'Sunday Special Evening Orders' : 'Fresh Homemade Lunch & Dinner'
      });
    }
    setSchedule(defaultSlots);
  };

  const handleToggleSlot = (index: number) => {
    setSchedule(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        isAvailable: !copy[index].isAvailable
      };
      return copy;
    });
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });
  };

  const handleNotesChange = (index: number, notes: string) => {
    setSchedule(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        notes
      };
      return copy;
    });
  };

  const applyQuickPreset = (preset: 'ALL_AVAILABLE' | 'WEEKDAYS_ONLY' | 'WEEKENDS_ONLY') => {
    setSchedule(prev => prev.map(slot => {
      const d = new Date(slot.date);
      const day = d.getDay(); // 0 is Sun, 6 is Sat
      const isWeekend = day === 0 || day === 6;

      let isAvailable = true;
      if (preset === 'WEEKDAYS_ONLY') isAvailable = !isWeekend;
      if (preset === 'WEEKENDS_ONLY') isAvailable = isWeekend;

      return {
        ...slot,
        isAvailable
      };
    }));
  };

  const handleSaveSchedule = async () => {
    if (!cookProfile && !isDemo) return;
    const cookId = cookProfile?.id || (isDemo ? 'cook_priya' : `cook_${user?.id}`);

    try {
      setIsSaving(true);
      setErrorMsg(null);
      setSaveSuccess(null);

      const res = await api.updateCookAvailability(cookId, schedule);
      if (res.success) {
        setSaveSuccess("Kitchen availability & calendar schedule successfully updated!");
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setErrorMsg("Failed to save schedule. Please try again.");
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMsg(err.message || "Failed to persist schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 w-full max-w-full overflow-x-hidden">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/cook-dashboard"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Back to Cook Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Cook Hub
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kitchen Availability & Working Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Set your cooking dates, daily operating hours, and kitchen capacity. Customers view this schedule before ordering.
          </p>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSaveSchedule}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isSaving ? (
            <span>Saving Schedule...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Schedule
            </>
          )}
        </button>
      </div>

      {/* SUCCESS / ERROR ALERTS */}
      {saveSuccess && (
        <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* QUICK PRESET CONTROLS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Quick Schedule Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyQuickPreset('ALL_AVAILABLE')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Available All 7 Days
          </button>
          <button
            onClick={() => applyQuickPreset('WEEKDAYS_ONLY')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Monday – Friday Only
          </button>
          <button
            onClick={() => applyQuickPreset('WEEKENDS_ONLY')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Saturday & Sunday Only
          </button>
        </div>
      </div>

      {/* SCHEDULE SLOTS LIST */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((slot, index) => (
            <div
              key={slot.id || index}
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                slot.isAvailable
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* DATE & DAY BADGE */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      slot.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {formatDateDisplay(slot.date)}
                      </h3>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          slot.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {slot.isAvailable ? 'AVAILABLE' : 'CLOSED / OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {slot.date} ({slot.dayName || 'Day'})
                    </p>
                  </div>
                </div>

                {/* CONTROLS (HOURS & TOGGLE) */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {/* TIME PICKERS (ACTIVE WHEN AVAILABLE) */}
                  {slot.isAvailable && (
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={slot.startTime}
                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                        placeholder="10:00 AM"
                        className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <span className="text-slate-400 font-bold">to</span>
                      <input
                        type="text"
                        value={slot.endTime}
                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                        placeholder="02:00 PM"
                        className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* TOGGLE BUTTON */}
                  <button
                    onClick={() => handleToggleSlot(index)}
                    className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      slot.isAvailable
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                    }`}
                  >
                    {slot.isAvailable ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Mark Closed
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Open Kitchen
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIONAL NOTES INPUT */}
              {slot.isAvailable && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <input
                    type="text"
                    value={slot.notes || ''}
                    onChange={(e) => handleNotesChange(index, e.target.value)}
                    placeholder="Add cooking note (e.g. Lunch & Dinner available, Andhra thali special)"
                    className="w-full text-xs text-slate-700 placeholder:text-slate-400 bg-transparent border-0 focus:ring-0 p-0 font-medium"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM SAVE BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-slate-300">
            Remember to click <strong className="text-white">Save Schedule</strong> after toggling your available dates or updating your hours.
          </p>
        </div>
        <button
          onClick={handleSaveSchedule}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Schedule Now"}
        </button>
      </div>
    </div>
  );
};
