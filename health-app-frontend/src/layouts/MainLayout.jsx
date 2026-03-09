import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/workouts",  label: "Workouts",  icon: "🏋️" },
  { to: "/nutrition", label: "Nutrition", icon: "🥗" },
  { to: "/goals",     label: "Goals",     icon: "🎯" },
];

function getInitials(name) {
  if (!name) return "?";
  return name.trim().split(" ").filter(Boolean).map((n) => n[0].toUpperCase()).slice(0, 2).join("");
}

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  const { user, clearUser } = useUser();
  const initials     = getInitials(user?.name);
  const profilePhoto = user?.profilePhoto || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("theme");
    clearUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      
      <aside className={`
        bg-white shadow-lg w-64 flex flex-col
        fixed inset-y-0 left-0 z-40
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex
      `}>
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-bold text-indigo-600">HealthPro</h1>
          <p className="text-xs text-gray-400 mt-0.5">Your fitness companion</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        
        <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <span className="hidden sm:block text-gray-500 text-sm font-medium">
              Welcome back, {user?.name || "there"} 👋
            </span>
          </div>

          <div className="md:hidden font-bold text-indigo-600 text-lg">HealthPro</div>

          
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden hover:bg-indigo-700 transition"
            >
              {profilePhoto
                ? <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                : initials}
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-xl z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                  </div>
                  {[
                    { label: "Profile",       path: "/profile",       icon: "👤" },
                    { label: "Settings",      path: "/settings",      icon: "⚙️" },
                    { label: "Notifications", path: "/notifications", icon: "🔔" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <span>{item.icon}</span><span>{item.label}</span>
                    </button>
                  ))}
                  <div className="border-t" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <span>🚪</span><span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
