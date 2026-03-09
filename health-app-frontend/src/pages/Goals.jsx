import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Goals() {
  const navigate = useNavigate();
  const [goals, setGoals]       = useState([]);
  const [goalType, setGoalType] = useState("workout");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const [workoutForm, setWorkoutForm]     = useState({ caloriesBurnedTarget: "", workoutDurationTarget: "" });
  const [nutritionForm, setNutritionForm] = useState({ proteinTarget: "", carbsTarget: "", fatTarget: "" });

  const fetchGoals = async () => {
    try {
      const res = await API.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error("Fetch Goals Error:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const payload = { type: goalType };

    if (goalType === "workout") {
      if (!workoutForm.caloriesBurnedTarget && !workoutForm.workoutDurationTarget)
        return setError("Enter at least one workout goal.");
      Object.assign(payload, workoutForm);
    } else {
      if (!nutritionForm.proteinTarget && !nutritionForm.carbsTarget && !nutritionForm.fatTarget)
        return setError("Enter at least one nutrition goal.");
      Object.assign(payload, nutritionForm);
    }

    try {
      await API.post("/goals", payload);
      setSuccess("Goal saved! Redirecting to dashboard…");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create goal.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error("Delete Goal Error:", err);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Goals</h1>

        
        <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Set a New Goal</h2>

          
          <div className="flex gap-2 mb-5">
            {["workout", "nutrition"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setGoalType(t); setError(""); setSuccess(""); }}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${
                  goalType === t
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
                }`}
              >
                {t === "workout" ? "🏋️ Workout Goal" : "🥗 Nutrition Goal"}
              </button>
            ))}
          </div>

          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goalType === "workout" ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Calories Burned Target (kcal)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 500"
                    value={workoutForm.caloriesBurnedTarget}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, caloriesBurnedTarget: e.target.value })}
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Workout Duration Target (minutes)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 60"
                    value={workoutForm.workoutDurationTarget}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, workoutDurationTarget: e.target.value })}
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Daily Protein Target (g)</label>
                  <input
                    type="number" min="0" placeholder="e.g. 150"
                    value={nutritionForm.proteinTarget}
                    onChange={(e) => setNutritionForm({ ...nutritionForm, proteinTarget: e.target.value })}
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Daily Carbs Target (g)</label>
                  <input
                    type="number" min="0" placeholder="e.g. 250"
                    value={nutritionForm.carbsTarget}
                    onChange={(e) => setNutritionForm({ ...nutritionForm, carbsTarget: e.target.value })}
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Daily Fat Target (g)</label>
                  <input
                    type="number" min="0" placeholder="e.g. 70"
                    value={nutritionForm.fatTarget}
                    onChange={(e) => setNutritionForm({ ...nutritionForm, fatTarget: e.target.value })}
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="sm:col-span-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm"
            >
              Save Goal → Go to Dashboard
            </button>
          </form>
        </div>

        
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Goals</h2>
          {goals.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🎯</p>
              <p className="font-medium">No goals set yet</p>
              <p className="text-sm mt-1">Set your first goal above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal._id}
                  className="flex items-start sm:items-center justify-between border border-gray-100 p-4 rounded-xl hover:bg-gray-50 transition gap-3 group"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                      goal.type === "workout" ? "bg-indigo-100" : "bg-green-100"
                    }`}>
                      {goal.type === "workout" ? "🏋️" : "🥗"}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        goal.type === "workout" ? "bg-indigo-100 text-indigo-600" : "bg-green-100 text-green-600"
                      }`}>
                        {goal.type === "workout" ? "Workout" : "Nutrition"}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {goal.type === "workout"
                          ? `Burn: ${goal.caloriesBurnedTarget || 0} kcal • Duration: ${goal.workoutDurationTarget || 0} min`
                          : `Protein: ${goal.proteinTarget || 0}g • Carbs: ${goal.carbsTarget || 0}g • Fat: ${goal.fatTarget || 0}g`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="text-red-400 hover:text-red-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition shrink-0"
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
