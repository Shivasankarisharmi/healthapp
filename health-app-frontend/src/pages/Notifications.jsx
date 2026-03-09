import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

const DEFAULT_PREFS = {
  notifGoalAchieved:      true,
  notifStreak:            true,
  notifDailyReminder:     false,
  notifDailyReminderTime: "08:00",
  notifWeeklySummary:     true,
};


function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0 ${
          checked ? "bg-indigo-600" : "bg-gray-300"
        }`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function Notifications() {
  const [prefs, setPrefs]       = useState(DEFAULT_PREFS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");
  const [alerts, setAlerts]     = useState([
    { id: 1, icon: "🎯", msg: "You hit your calorie goal today!", time: "2 hrs ago",  read: false },
    { id: 2, icon: "🔥", msg: "3-day workout streak! Keep it up.",  time: "Yesterday", read: false },
    { id: 3, icon: "📊", msg: "Your weekly summary is ready.",       time: "3 days ago",read: true  },
  ]);

  
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/user/profile");
        const u   = res.data;
        setPrefs({
          notifGoalAchieved:      u.notifGoalAchieved      ?? true,
          notifStreak:            u.notifStreak            ?? true,
          notifDailyReminder:     u.notifDailyReminder     ?? false,
          notifDailyReminderTime: u.notifDailyReminderTime || "08:00",
          notifWeeklySummary:     u.notifWeeklySummary     ?? true,
        });
      } catch (err) {
        console.error("Fetch prefs error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setPref = (key, value) => setPrefs((p) => ({ ...p, [key]: value }));

  const showMsg = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  
  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      await API.put("/user/notifications", prefs);
      showMsg("Notification preferences saved!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const dismissAlert  = (id) => setAlerts((a) => a.filter((x) => x.id !== id));
  const dismissAll    = ()   => setAlerts([]);
  const markRead      = (id) => setAlerts((a) => a.map((x) => x.id === id ? { ...x, read: true } : x));

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Notifications</h1>

        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">✅ {success}</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">❌ {error}</div>
        )}

        
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              Recent Alerts
              {alerts.filter((a) => !a.read).length > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {alerts.filter((a) => !a.read).length}
                </span>
              )}
            </h2>
            {alerts.length > 0 && (
              <button
                type="button"
                onClick={dismissAll}
                className="text-xs text-gray-400 hover:text-red-500 transition font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">🔔</p>
              <p className="font-medium text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => markRead(alert.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                    alert.read ? "bg-gray-50" : "bg-indigo-50 border border-indigo-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{alert.icon}</span>
                    <div>
                      <p className={`text-sm ${alert.read ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                        {alert.msg}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}
                    className="text-gray-300 hover:text-red-400 transition ml-2 shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Preferences</h2>
          <div className="divide-y divide-gray-100">
            <ToggleSwitch
              checked={prefs.notifGoalAchieved}
              onChange={(v) => setPref("notifGoalAchieved", v)}
              label="🎯 Goal Achieved"
              description="Alert when you hit your daily calorie or workout goal"
            />
            <ToggleSwitch
              checked={prefs.notifStreak}
              onChange={(v) => setPref("notifStreak", v)}
              label="🔥 Streak Alerts"
              description="Notify when you maintain a workout streak"
            />
            <ToggleSwitch
              checked={prefs.notifWeeklySummary}
              onChange={(v) => setPref("notifWeeklySummary", v)}
              label="📊 Weekly Summary"
              description="Receive a weekly progress report every Sunday"
            />
            <ToggleSwitch
              checked={prefs.notifDailyReminder}
              onChange={(v) => setPref("notifDailyReminder", v)}
              label="⏰ Daily Reminder"
              description="Daily nudge to log your workout or meals"
            />

            
            {prefs.notifDailyReminder && (
              <div className="py-3 pl-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={prefs.notifDailyReminderTime}
                  onChange={(e) => setPref("notifDailyReminderTime", e.target.value)}
                  className="border border-indigo-200 rounded-lg px-3 py-1.5 text-sm text-indigo-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Preferences"}
          </button>
        </div>

        
        {prefs.notifWeeklySummary && (
          <div className="rounded-2xl p-5 sm:p-6 text-white shadow-md" style={{ background: "linear-gradient(to bottom right, #22c55e, #059669)" }}>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              📅 This Week&apos;s Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Workouts",     value: "4",     icon: "🏋️" },
                { label: "Avg Calories", value: "1,850", icon: "🔥" },
                { label: "Active Days",  value: "5/7",   icon: "📅" },
                { label: "Goals Hit",    value: "3×",    icon: "🎯" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <p className="text-lg">{stat.icon}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-100 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
