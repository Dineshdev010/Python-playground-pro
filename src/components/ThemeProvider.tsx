// ============================================================
// THEME PROVIDER — src/components/ThemeProvider.tsx
// Manages dark/light theme toggle.
// Saves preference to localStorage so it persists across visits.
// ============================================================

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Only two themes supported
type Theme = "dark" | "light";
type ThemeMode = "auto" | "manual";

// Context shape: current theme + toggle function
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Default: dark mode, no-op toggle (overridden by provider)
const ThemeContext = createContext<ThemeContextType>({ theme: "dark", toggleTheme: () => {} });
const THEME_KEY = "pymaster_theme";
const THEME_MODE_KEY = "pymaster_theme_mode";

function getClockTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

/**
 * useTheme() — Access the current theme and toggle function.
 * Usage: const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * ThemeProvider — Wraps the app to provide theme context.
 * 
 * How it works:
 * 1. On mount, reads saved theme from localStorage (default: "dark")
 * 2. Adds the theme class to <html> element (Tailwind uses this for dark mode)
 * 3. toggleTheme() switches between "dark" and "light"
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem(THEME_MODE_KEY) === "manual" ? "manual" : "auto";
    } catch {
      return "auto";
    }
  });
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY);
      const storedMode = localStorage.getItem(THEME_MODE_KEY);
      if (storedMode === "manual" && (storedTheme === "light" || storedTheme === "dark")) {
        return storedTheme;
      }
      return getClockTheme();
    } catch {
      return getClockTheme();
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(THEME_MODE_KEY, themeMode);
  }, [theme, themeMode]);

  useEffect(() => {
    if (themeMode !== "auto") return;

    const syncThemeWithClock = () => {
      setTheme(getClockTheme());
    };

    syncThemeWithClock();
    const interval = window.setInterval(syncThemeWithClock, 2 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode("manual");
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
