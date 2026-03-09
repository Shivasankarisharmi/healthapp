import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    
    return localStorage.getItem("theme") || "light";
  });

  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    API.get("/user/profile")
      .then((res) => {
        const serverTheme = res.data?.theme;
        if (serverTheme) setTheme(serverTheme);
      })
      .catch(() => {});
  }, []); 

  const applyTheme = (newTheme) => setTheme(newTheme);

  return (
    <ThemeContext.Provider value={{ theme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
