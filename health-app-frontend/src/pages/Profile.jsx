import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

const goalOptions = [
  { value: "weight_loss", label: "⚖️ Weight Loss", desc: "Burn fat, reduce body weight" },
  { value: "muscle_gain", label: "💪 Muscle Gain", desc: "Build strength and muscle mass" },
  { value: "maintenance", label: "🔄 Maintenance", desc: "Stay at current fitness level" },
];

const TABS = [
  { id: "info",     icon: "👤", label: "Personal Info" },
  { id: "body",     icon: "📊", label: "Body Stats"    },
  { id: "goal",     icon: "🎯", label: "Fitness Goal"  },
  { id: "password", icon: "🔒", label: "Password"      },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");

  const [form, setForm] = useState({
    name: "", email: "", age: "", height: "", weight: "", goalType: "", profilePhoto: "",
  });

  const [pwForm, setPwForm]   = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const fileInputRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/user/profile");
        const u = res.data;
        setForm({
          name: u.name || "", email: u.email || "",
          age: u.age || "", height: u.height || "", weight: u.weight || "",
          goalType: u.goalType || "", profilePhoto: u.profilePhoto || "",
        });
      } catch { setError("Failed to load profile."); }
      finally { setLoading(false); }
    })();
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg); setError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Photo must be under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      await API.put("/user/profile", form);
      showSuccess("Profile updated successfully!");
    } catch (err) { setError(err.response?.data?.message || "Failed to save profile."); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); setPwError(""); setPwSuccess("");
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError("New passwords do not match.");
    if (pwForm.newPassword.length < 6) return setPwError("Password must be at least 6 characters.");
    try {
      await API.put("/user/profile/password", {
        currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword,
      });
      setPwSuccess("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { setPwError(err.response?.data?.message || "Failed to change password."); }
  };

  const bmi = form.height && form.weight
    ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) : null;
  const bmiLabel = !bmi ? "" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = !bmi ? "" : bmi < 18.5 ? "text-blue-500" : bmi < 25 ? "text-green-500" : bmi < 30 ? "text-yellow-500" : "text-red-500";

  const initials = form.name
    ? form.name.trim().split(" ").filter(Boolean).map((n) => n[0].toUpperCase()).slice(0, 2).join("")
    : "?";

  const inputCls = "border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm";
  const saveBtnCls = "w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm disabled:opacity-60";

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
      <div className="max-w-2xl mx-auto space-y-5">

        
        <div className="rounded-2xl p-5 sm:p-6 text-white shadow-lg" style={{ background: "linear-gradient(to bottom right, #4f46e5, #3730a3)" }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">

            
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center shadow-md" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                {form.profilePhoto
                  ? <img src={form.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-3xl font-bold text-white">{initials}</span>}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-indigo-50 transition text-sm"
                title="Change photo"
              >📷</button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>

            
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold truncate">{form.name || "Your Name"}</h2>
              <p className="text-indigo-200 text-sm mt-0.5 truncate">{form.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                {form.age    && <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>🎂 {form.age} yrs</span>}
                {form.weight && <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>⚖️ {form.weight} kg</span>}
                {form.height && <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>📏 {form.height} cm</span>}
                {bmi         && <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>BMI {bmi} · {bmiLabel}</span>}
              </div>
              {form.goalType && (
                <p className="text-indigo-200 text-xs mt-1.5">
                  🎯 {goalOptions.find((g) => g.value === form.goalType)?.label}
                </p>
              )}
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSuccess(""); setError(""); }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-500 border border-gray-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

       
        <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">

        
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              ❌ {error}
            </div>
          )}

         
          {activeTab === "info" && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputCls} />
              </div>
              <button type="submit" disabled={saving} className={saveBtnCls}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          
          {activeTab === "body" && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">Body Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Age (years)</label>
                  <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="25" min="1" max="120" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Height (cm)</label>
                  <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="170" min="50" max="300" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Weight (kg)</label>
                  <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="70" min="1" max="500" className={inputCls} />
                </div>
              </div>

              {bmi && (
                <div className="bg-gray-50 border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Your BMI</p>
                    <p className={`text-3xl font-bold ${bmiColor}`}>{bmi}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-bold ${bmiColor}`}>{bmiLabel}</span>
                    <p className="text-xs text-gray-400 mt-0.5">Based on height & weight</p>
                  </div>
                </div>
              )}

              <button type="submit" disabled={saving} className={saveBtnCls}>
                {saving ? "Saving..." : "Save Body Stats"}
              </button>
            </form>
          )}

          
          {activeTab === "goal" && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">Fitness Goal Type</h3>
              <div className="space-y-3">
                {goalOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                      form.goalType === opt.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio" name="goalType" value={opt.value}
                      checked={form.goalType === opt.value} onChange={handleChange}
                      className="accent-indigo-600 w-4 h-4 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button type="submit" disabled={saving} className={saveBtnCls}>
                {saving ? "Saving..." : "Save Goal Type"}
              </button>
            </form>
          )}

         
          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">Change Password</h3>

              {pwSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">✅ {pwSuccess}</div>
              )}
              {pwError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">❌ {pwError}</div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Current Password</label>
                <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))} placeholder="Enter current password" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">New Password</label>
                <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))} placeholder="Min. 6 characters" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Confirm New Password</label>
                <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Repeat new password" className={inputCls} />
              </div>
              <button type="submit" className={saveBtnCls}>
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
