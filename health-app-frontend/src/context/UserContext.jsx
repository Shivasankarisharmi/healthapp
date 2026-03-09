import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setUser(null); return; }
    try {
      const res = await API.get("/user/profile");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const clearUser = () => setUser(null);

  useEffect(() => { refreshUser(); }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  // Return a safe default so destructuring never crashes even if Provider is missing
  if (!ctx) return { user: null, refreshUser: () => {}, clearUser: () => {} };
  return ctx;
}
