import { useState, useEffect } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

const MET_VALUES = { running: 9.8, cycling: 7.5, walking: 3.8, strength: 6.0 };
const WEIGHT = 70;

const TYPE_ICONS = { running: "🏃", cycling: "🚴", walking: "🚶", strength: "🏋️" };
const TYPE_COLORS = {
  running:  "bg-orange-100 text-orange-600",
  cycling:  "bg-blue-100 text-blue-600",
  walking:  "bg-green-100 text-green-600",
  strength: "bg-purple-100 text-purple-600",
};

export default function Workouts() {
  const [mode, setMode]                   = useState("auto");
  const [type, setType]                   = useState("");
  const [duration, setDuration]           = useState("");
  const [distance, setDistance]           = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [workouts, setWorkouts]           = useState([]);
  const [workoutGoal, setWorkoutGoal]     = useState(null);
  const [error, setError]                 = useState("");

  
  const today          = new Date().toDateString();
  const todayWorkouts  = workouts.filter((w) => new Date(w.createdAt).toDateString() === today);
  const todayBurned    = todayWorkouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const todayDuration  = todayWorkouts.reduce((s, w) => s + (w.duration || 0), 0);

  
  const fetchWorkouts = async () => {
    try {
      const res = await API.get("/workouts");
      setWorkouts(res.data);
    } catch (err) {
      console.error("Fetch workouts error:", err);
    }
  };

  const fetchGoal = async () => {
    try {
      const res = await API.get("/goals");
      const wGoal = res.data.find((g) => g.type === "workout");
      setWorkoutGoal(wGoal || null);
    } catch (err) {
      console.error("Fetch goal error:", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    fetchGoal();
  }, []);

  useEffect(() => {
    if (mode === "auto" && type && duration) {
      const met    = MET_VALUES[type] || 5;
      const result = Math.round(((met * 3.5 * WEIGHT) / 200) * Number(duration));
      setCaloriesBurned(result);
    }
  }, [type, duration, mode]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!type)                                              return setError("Please select a workout type.");
    if (!duration || Number(duration) <= 0)                return setError("Enter a valid duration.");
    if (mode === "manual" && (!caloriesBurned || Number(caloriesBurned) <= 0))
      return setError("Enter valid calories for manual mode.");

    try {
      await API.post("/workouts", { type, duration, distance, caloriesBurned, mode });
      setType(""); setDuration(""); setDistance(""); setCaloriesBurned(""); setMode("auto");
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add workout.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Workouts</h1>

        
        {workoutGoal && (
          <div className="rounded-2xl p-4 sm:p-6 text-white shadow-md" style={{ background: "linear-gradient(to right, #6366f1, #4338ca)" }}>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">🎯 Today's Goal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workoutGoal.caloriesBurnedTarget > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <p className="text-xs text-indigo-100 mb-1">Calories to Burn</p>
                  <p className="text-2xl font-bold">
                    {todayBurned}
                    <span className="text-sm font-normal text-indigo-200"> / {workoutGoal.caloriesBurnedTarget} kcal</span>
                  </p>
                  <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((todayBurned / workoutGoal.caloriesBurnedTarget) * 100))}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-indigo-200">
                    {Math.min(100, Math.round((todayBurned / workoutGoal.caloriesBurnedTarget) * 100))}% complete
                  </p>
                </div>
              )}
              {workoutGoal.workoutDurationTarget > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <p className="text-xs text-indigo-100 mb-1">Duration Target</p>
                  <p className="text-2xl font-bold">
                    {todayDuration}
                    <span className="text-sm font-normal text-indigo-200"> / {workoutGoal.workoutDurationTarget} min</span>
                  </p>
                  <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((todayDuration / workoutGoal.workoutDurationTarget) * 100))}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-indigo-200">
                    {Math.min(100, Math.round((todayDuration / workoutGoal.workoutDurationTarget) * 100))}% complete
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b gap-4">
            <h2 className="text-lg font-semibold text-gray-800 shrink-0">Log Workout</h2>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => { setMode("auto"); setCaloriesBurned(""); }}
                className={`px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "auto"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => { setMode("manual"); setCaloriesBurned(""); }}
                className={`px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "manual"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          
          <div className={`px-5 py-2 text-xs font-medium ${mode === "auto" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"}`}>
            {mode === "auto"
              ? "🤖 Auto mode: calories calculated from workout type & duration"
              : "✏️ Manual mode: enter your own calorie value"}
          </div>

          
          <div className="p-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Workout Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                >
                  <option value="">Select type…</option>
                  <option value="running">🏃 Running</option>
                  <option value="cycling">🚴 Cycling</option>
                  <option value="walking">🚶 Walking</option>
                  <option value="strength">🏋️ Strength Training</option>
                </select>
              </div>

              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Duration (minutes)</label>
                <input
                  type="number" min="1"
                  placeholder="e.g. 30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
              </div>

              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Distance (km) — optional</label>
                <input
                  type="number" min="0" step="0.1"
                  placeholder="e.g. 5"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
              </div>

              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Calories Burned</label>
                {mode === "auto" ? (
                  <div className="border border-indigo-200 p-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-sm flex items-center gap-2">
                    🔥 {caloriesBurned || 0} kcal
                  </div>
                ) : (
                  <input
                    type="number" min="1"
                    placeholder="e.g. 300"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                )}
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm"
              >
                + Add Workout
              </button>
            </form>
          </div>
        </div>

       
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Workouts</h2>
          {workouts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🏋️</p>
              <p className="font-medium">No workouts logged yet</p>
              <p className="text-sm mt-1">Add your first workout above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center justify-between border border-gray-100 p-4 rounded-xl hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${TYPE_COLORS[w.type] || "bg-gray-100"}`}>
                      {TYPE_ICONS[w.type] || "💪"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold capitalize text-gray-800">{w.type}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {w.duration} min
                        {w.distance > 0 && ` • ${w.distance} km`}
                        {" • "}
                        <span className="text-orange-500 font-medium">{w.caloriesBurned} kcal</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${w.mode === "auto" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"}`}>
                          {w.mode}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="text-red-400 hover:text-red-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition shrink-0 ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
