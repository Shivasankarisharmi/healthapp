import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Filler
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("today");
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [dashRes, goalsRes] = await Promise.all([
          API.get(`/dashboard?period=${period}`),
          API.get("/goals"),
        ]);
        setData(dashRes.data);
        setGoals(goalsRes.data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [period]);

  const workoutGoal = goals.find((g) => g.type === "workout");
  const nutritionGoal = goals.find((g) => g.type === "nutrition");

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const pieData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [{
      data: [data?.macros?.protein || 0, data?.macros?.carbs || 0, data?.macros?.fat || 0],
      backgroundColor: ["#6366F1", "#22C55E", "#F59E0B"],
      borderWidth: 2,
      borderColor: "#fff",
    }],
  };

  const lineData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Calories Burned",
        data: data?.caloriesBurnedBreakdown || [],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: period === "month" ? 2 : 4,
        pointHoverRadius: 5,
      },
      {
        label: "Calories Consumed",
        data: data?.caloriesConsumedBreakdown || [],
        borderColor: "#22C55E",
        backgroundColor: "rgba(34,197,94,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: period === "month" ? 2 : 4,
        pointHoverRadius: 5,
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { boxWidth: 12, font: { size: 12 } } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: period === "month" ? 10 : undefined,
          maxRotation: period === "month" ? 45 : 0,
          font: { size: 11 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 11 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>

        
        {(workoutGoal || nutritionGoal) && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-3">
              🎯 Today's Goal
            </h2>
            <div className="flex flex-wrap gap-3">
              {workoutGoal && (
                <>
                  {workoutGoal.caloriesBurnedTarget > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-indigo-100 rounded-xl px-3 py-2 shadow-sm">
                      <span className="text-lg">🔥</span>
                      <div>
                        <p className="text-xs text-gray-500">Burn Target</p>
                        <p className="font-bold text-indigo-700 text-sm">{workoutGoal.caloriesBurnedTarget} kcal</p>
                      </div>
                    </div>
                  )}
                  {workoutGoal.workoutDurationTarget > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-indigo-100 rounded-xl px-3 py-2 shadow-sm">
                      <span className="text-lg">⏱️</span>
                      <div>
                        <p className="text-xs text-gray-500">Duration Target</p>
                        <p className="font-bold text-indigo-700 text-sm">{workoutGoal.workoutDurationTarget} min</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {nutritionGoal && (
                <>
                  {nutritionGoal.proteinTarget > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm">
                      <span className="text-lg">💪</span>
                      <div>
                        <p className="text-xs text-gray-500">Protein Target</p>
                        <p className="font-bold text-green-700 text-sm">{nutritionGoal.proteinTarget}g</p>
                      </div>
                    </div>
                  )}
                  {nutritionGoal.carbsTarget > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-yellow-100 rounded-xl px-3 py-2 shadow-sm">
                      <span className="text-lg">🌾</span>
                      <div>
                        <p className="text-xs text-gray-500">Carbs Target</p>
                        <p className="font-bold text-yellow-700 text-sm">{nutritionGoal.carbsTarget}g</p>
                      </div>
                    </div>
                  )}
                  {nutritionGoal.fatTarget > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-orange-100 rounded-xl px-3 py-2 shadow-sm">
                      <span className="text-lg">🥑</span>
                      <div>
                        <p className="text-xs text-gray-500">Fat Target</p>
                        <p className="font-bold text-orange-700 text-sm">{nutritionGoal.fatTarget}g</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {["today", "week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 sm:px-5 py-2 rounded-full font-medium capitalize text-sm transition ${
                period === p
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white border text-gray-600 hover:bg-indigo-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Calories Consumed", value: data?.caloriesConsumed || 0, color: "text-green-600", bg: "bg-green-50", icon: "🥗", unit: "kcal" },
            { label: "Workouts Completed", value: data?.workoutCount || 0, color: "text-indigo-600", bg: "bg-indigo-50", icon: "🏋️", unit: "sessions" },
            { label: "Calories Burned", value: data?.caloriesBurned || 0, color: "text-orange-500", bg: "bg-orange-50", icon: "🔥", unit: "kcal" },
          ].map((card) => (
            <div key={card.label} className="bg-white p-5 rounded-2xl border shadow-sm">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
                {card.icon}
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">{card.label}</p>
              <h2 className={`text-2xl sm:text-3xl font-bold mt-1 ${card.color}`}>{card.value}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{card.unit}</p>
            </div>
          ))}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">Macros Breakdown</h3>
            <div className="h-60 sm:h-72">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">Calorie Trend</h3>
            <div className="h-60 sm:h-72 overflow-hidden">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
