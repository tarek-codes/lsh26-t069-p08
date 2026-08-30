"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // On mount: read persisted preference, default to dark
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved === "light" ? "light" : "dark";
    applyTheme(initial);
    setTheme(initial);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
