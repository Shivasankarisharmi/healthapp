import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { useTheme } from "../context/ThemeContext";

const DEFAULT_SETTINGS = {
  theme: "light",
  dailyCalorieTarget: 2000,
  unitWeight: "kg",
  unitDistance: "km",
};

export default function Settings() {
  const navigate = useNavigate();
  const { theme, applyTheme } = useTheme();

  
  useEffect(() => {
    setSettings((s) => ({ ...s, theme }));
  }, [theme]);
  const [settings, setSettings]       = useState(DEFAULT_SETTINGS);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [success, setSuccess]         = useState("");
  const [error, setError]             = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword]   = useState("");
  const [deleteError, setDeleteError]         = useState("");

  
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/user/profile");
        const u   = res.data;
        setSettings({
          theme:              u.theme              || "light",
          dailyCalorieTarget: u.dailyCalorieTarget || 2000,
          unitWeight:         u.unitWeight         || "kg",
          unitDistance:       u.unitDistance       || "km",
        });
       
        if (u.theme) applyTheme(u.theme);
      } catch (err) {
        console.error("Fetch settings error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showMsg = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  
  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      await API.put("/user/settings", settings);
      showMsg("Settings saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  
  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (!deletePassword) return setDeleteError("Password is required.");
    try {
      await API.delete("/user/account", { data: { password: deletePassword } });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Incorrect password.");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const sectionCls  = "bg-white rounded-2xl border shadow-sm p-5 sm:p-6";
  const toggleBtnCls = (active) =>
    `flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
      active ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
    }`;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Settings</h1>

       
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">✅ {success}</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">❌ {error}</div>
        )}

        
        <div className={sectionCls}>
          <h2 className="text-base font-semibold text-gray-800 mb-1">🎨 App Theme</h2>
          <p className="text-sm text-gray-500 mb-4">Choose your preferred display theme.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setSettings((s) => ({ ...s, theme: "light" })); applyTheme("light"); }}
              className={toggleBtnCls(settings.theme === "light")}
            >
              ☀️ Light
            </button>
            <button
              type="button"
              onClick={() => { setSettings((s) => ({ ...s, theme: "dark" })); applyTheme("dark"); }}
              className={toggleBtnCls(settings.theme === "dark")}
            >
              🌙 Dark
            </button>
          </div>
        </div>

       
        <div className={sectionCls}>
          <h2 className="text-base font-semibold text-gray-800 mb-1">🔥 Daily Calorie Target</h2>
          <p className="text-sm text-gray-500 mb-4">Set your daily calorie consumption goal.</p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000" max="5000" step="50"
              value={settings.dailyCalorieTarget}
              onChange={(e) => setSettings((s) => ({ ...s, dailyCalorieTarget: Number(e.target.value) }))}
              className="flex-1 accent-indigo-600"
            />
            <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-center w-24">
              <p className="text-lg font-bold text-indigo-600">{settings.dailyCalorieTarget}</p>
              <p className="text-xs text-gray-400">kcal/day</p>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
            <span>1,000</span><span>5,000</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {[1500, 2000, 2500, 3000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSettings((s) => ({ ...s, dailyCalorieTarget: v }))}
                className={`text-xs px-3 py-1.5 rounded-full transition ${
                  settings.dailyCalorieTarget === v
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
                }`}
              >
                {v} kcal
              </button>
            ))}
          </div>
        </div>

        
        <div className={sectionCls}>
          <h2 className="text-base font-semibold text-gray-800 mb-4">📏 Unit Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Weight Unit</label>
              <div className="flex gap-2">
                {["kg", "lbs"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, unitWeight: u }))}
                    className={toggleBtnCls(settings.unitWeight === u)}
                  >
                    {u === "kg" ? "⚖️ kg" : "⚖️ lbs"}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Distance Unit</label>
              <div className="flex gap-2">
                {["km", "miles"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, unitDistance: u }))}
                    className={toggleBtnCls(settings.unitDistance === u)}
                  >
                    {u === "km" ? "📏 km" : "📏 miles"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>

        
        <div className="bg-white rounded-2xl border border-red-200 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-red-600 mb-1">⚠️ Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => { setShowDeleteModal(true); setDeleteError(""); setDeletePassword(""); }}
            className="bg-red-50 border border-red-300 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
          >
            Delete My Account
          </button>
        </div>

        
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800">⚠️ Delete Account</h3>
              <p className="text-sm text-gray-500">
                This will permanently delete your account, workouts, nutrition logs, and goals.
                Enter your password to confirm.
              </p>
              {deleteError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-3 py-2">
                  ❌ {deleteError}
                </div>
              )}
              <input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-red-300 text-sm"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
