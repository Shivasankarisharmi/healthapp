import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";


const NUTRITION_DB = {
  "chicken breast": { calories: 165, protein: 31,  carbs: 0,   fat: 3.6 },
  "rice":           { calories: 130, protein: 2.7, carbs: 28,  fat: 0.3 },
  "egg":            { calories: 155, protein: 13,  carbs: 1.1, fat: 11  },
  "banana":         { calories: 89,  protein: 1.1, carbs: 23,  fat: 0.3 },
  "oats":           { calories: 389, protein: 17,  carbs: 66,  fat: 7   },
  "milk":           { calories: 61,  protein: 3.2, carbs: 4.8, fat: 3.3 },
  "bread":          { calories: 265, protein: 9,   carbs: 49,  fat: 3.2 },
  "apple":          { calories: 52,  protein: 0.3, carbs: 14,  fat: 0.2 },
  "salmon":         { calories: 208, protein: 20,  carbs: 0,   fat: 13  },
  "sweet potato":   { calories: 86,  protein: 1.6, carbs: 20,  fat: 0.1 },
};

const EMPTY_FORM = { foodName: "", quantity: "", calories: "", protein: "", carbs: "", fat: "" };

export default function Nutrition() {
  const [mode, setMode]             = useState("manual");
  const [form, setForm]             = useState(EMPTY_FORM);
  const [foods, setFoods]           = useState([]);
  const [nutritionGoal, setNutritionGoal] = useState(null);
  const [suggestions, setSuggestions]     = useState([]);
  const [error, setError]           = useState("");

  
  const today         = new Date().toDateString();
  const todayFoods    = foods.filter((f) => new Date(f.createdAt).toDateString() === today);
  const todayProtein  = todayFoods.reduce((s, f) => s + (f.protein || 0), 0);
  const todayCarbs    = todayFoods.reduce((s, f) => s + (f.carbs   || 0), 0);
  const todayFat      = todayFoods.reduce((s, f) => s + (f.fat     || 0), 0);

  
  const fetchFoods = async () => {
    try {
      const res = await API.get("/nutrition");
      setFoods(res.data);
    } catch (err) {
      console.error("Fetch nutrition error:", err);
    }
  };

  const fetchGoal = async () => {
    try {
      const res = await API.get("/goals");
      const nGoal = res.data.find((g) => g.type === "nutrition");
      setNutritionGoal(nGoal || null);
    } catch (err) {
      console.error("Fetch goal error:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchGoal();
  }, []);

 
  useEffect(() => {
    if (mode === "auto" && form.foodName && form.quantity) {
      const key    = form.foodName.toLowerCase().trim();
      const dbItem = NUTRITION_DB[key];
      if (dbItem) {
        const ratio = Number(form.quantity) / 100;
        setForm((prev) => ({
          ...prev,
          calories: Math.round(dbItem.calories * ratio),
          protein:  Math.round(dbItem.protein  * ratio * 10) / 10,
          carbs:    Math.round(dbItem.carbs    * ratio * 10) / 10,
          fat:      Math.round(dbItem.fat      * ratio * 10) / 10,
        }));
      }
    }
  }, [form.foodName, form.quantity, mode]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "foodName" && mode === "auto") {
      const matches = Object.keys(NUTRITION_DB).filter((k) => k.includes(value.toLowerCase()));
      setSuggestions(value ? matches : []);
    }
  };

  const handleSuggestion = (name) => {
    setForm((prev) => ({ ...prev, foodName: name }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.foodName || !form.quantity) return setError("Food name and quantity are required.");
    if (Number(form.quantity) <= 0)        return setError("Quantity must be greater than 0.");

    try {
      await API.post("/nutrition", { ...form, mode });
      setForm(EMPTY_FORM);
      setSuggestions([]);
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add food.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/nutrition/${id}`);
      fetchFoods();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  
  const GoalBar = ({ label, current, target, color }) => {
    if (!target || target <= 0) return null;
    const pct = Math.min(100, Math.round((current / target) * 100));
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
        <p className={`text-xs ${color === "green" ? "text-green-100" : color === "yellow" ? "text-yellow-100" : "text-orange-100"} mb-1`}>
          {label}
        </p>
        <p className="text-2xl font-bold">
          {Math.round(current * 10) / 10}
          <span className={`text-sm font-normal ${color === "green" ? "text-green-200" : color === "yellow" ? "text-yellow-200" : "text-orange-200"}`}>
            {" "}/ {target}g
          </span>
        </p>
        <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className={`text-xs mt-1 ${color === "green" ? "text-green-200" : color === "yellow" ? "text-yellow-200" : "text-orange-200"}`}>
          {pct}% complete
        </p>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nutrition</h1>

        
        {nutritionGoal && (
          <div className="rounded-2xl p-4 sm:p-6 text-white shadow-md" style={{ background: "linear-gradient(to right, #22c55e, #059669)" }}>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">🎯 Today's Goal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <GoalBar label="💪 Protein" current={todayProtein} target={nutritionGoal.proteinTarget} color="green"  />
              <GoalBar label="🌾 Carbs"   current={todayCarbs}   target={nutritionGoal.carbsTarget}   color="yellow" />
              <GoalBar label="🥑 Fat"     current={todayFat}     target={nutritionGoal.fatTarget}     color="orange" />
            </div>
          </div>
        )}

       
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
         
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b gap-4">
            <h2 className="text-lg font-semibold text-gray-800 shrink-0">Log Food</h2>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => { setMode("manual"); setForm(EMPTY_FORM); setSuggestions([]); }}
                className={`px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "manual"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => { setMode("auto"); setForm(EMPTY_FORM); setSuggestions([]); }}
                className={`px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "auto"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          
          {mode === "auto" && (
            <div className="px-5 py-2 bg-green-50 text-green-700 text-xs font-medium">
              🤖 Auto mode: type a food name and quantity — macros are calculated automatically.
              Available: {Object.keys(NUTRITION_DB).join(", ")}
            </div>
          )}

          
          <div className="p-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Food Name</label>
                <input
                  type="text" name="foodName"
                  placeholder="e.g. chicken breast"
                  value={form.foodName}
                  onChange={handleChange}
                  required
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded-xl mt-1 w-full shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.map((s) => (
                      <li
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer capitalize text-sm"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Quantity (grams)</label>
                <input
                  type="number" name="quantity" min="1"
                  placeholder="e.g. 100"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
              </div>

             
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Calories (kcal)</label>
                {mode === "auto" ? (
                  <div className="border border-green-200 p-3 rounded-xl bg-green-50 text-green-700 font-semibold text-sm">
                    🔥 {form.calories || 0} kcal
                  </div>
                ) : (
                  <input type="number" name="calories" min="0" placeholder="e.g. 200" value={form.calories} onChange={handleChange} required
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm" />
                )}
              </div>

              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Protein (g)</label>
                {mode === "auto" ? (
                  <div className="border border-indigo-200 p-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-sm">
                    💪 {form.protein || 0}g
                  </div>
                ) : (
                  <input type="number" name="protein" min="0" placeholder="e.g. 25" value={form.protein} onChange={handleChange} required
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm" />
                )}
              </div>

              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Carbs (g)</label>
                {mode === "auto" ? (
                  <div className="border border-yellow-200 p-3 rounded-xl bg-yellow-50 text-yellow-700 font-semibold text-sm">
                    🌾 {form.carbs || 0}g
                  </div>
                ) : (
                  <input type="number" name="carbs" min="0" placeholder="e.g. 30" value={form.carbs} onChange={handleChange} required
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm" />
                )}
              </div>

              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Fat (g)</label>
                {mode === "auto" ? (
                  <div className="border border-orange-200 p-3 rounded-xl bg-orange-50 text-orange-700 font-semibold text-sm">
                    🥑 {form.fat || 0}g
                  </div>
                ) : (
                  <input type="number" name="fat" min="0" placeholder="e.g. 10" value={form.fat} onChange={handleChange} required
                    className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm" />
                )}
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm"
              >
                + Add Food
              </button>
            </form>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Food Logs</h2>
          {foods.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🥗</p>
              <p className="font-medium">No foods logged yet</p>
              <p className="text-sm mt-1">Add your first meal above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="flex items-center justify-between border border-gray-100 p-4 rounded-xl hover:bg-gray-50 transition group"
                >
                  <div className="min-w-0">
                    <p className="font-semibold capitalize text-gray-800">{food.foodName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {food.quantity}g
                      {" • "}
                      <span className="text-green-600 font-medium">{food.calories} kcal</span>
                      {" • P:"}
                      <span className="text-indigo-600 font-medium">{food.protein}g</span>
                      {" C:"}
                      <span className="text-yellow-600 font-medium">{food.carbs}g</span>
                      {" F:"}
                      <span className="text-orange-600 font-medium">{food.fat}g</span>
                      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${food.mode === "auto" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {food.mode}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(food._id)}
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
