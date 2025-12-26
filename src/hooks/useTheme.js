import { useState, useEffect, useCallback, useMemo } from "react";

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to document and CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
      root.style.colorScheme = "dark";
      
      // Set CSS variables for dark mode
      root.style.setProperty("--bg-primary", "#0a0a0f");
      root.style.setProperty("--bg-secondary", "#111827");
      root.style.setProperty("--bg-tertiary", "#1f2937");
      root.style.setProperty("--bg-card", "#1a1a2e");
      root.style.setProperty("--bg-input", "#1f2937");
      root.style.setProperty("--bg-hover", "#374151");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#d1d5db");
      root.style.setProperty("--text-tertiary", "#9ca3af");
      root.style.setProperty("--text-muted", "#6b7280");
      root.style.setProperty("--border-primary", "#374151");
      root.style.setProperty("--border-secondary", "#4b5563");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.5)");
      
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      body.classList.remove("dark");
      body.classList.add("light");
      root.style.colorScheme = "light";
      
      // Set CSS variables for light mode
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f9fafb");
      root.style.setProperty("--bg-tertiary", "#f3f4f6");
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--bg-input", "#f3f4f6");
      root.style.setProperty("--bg-hover", "#e5e7eb");
      root.style.setProperty("--text-primary", "#111827");
      root.style.setProperty("--text-secondary", "#374151");
      root.style.setProperty("--text-tertiary", "#6b7280");
      root.style.setProperty("--text-muted", "#9ca3af");
      root.style.setProperty("--border-primary", "#e5e7eb");
      root.style.setProperty("--border-secondary", "#d1d5db");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.1)");
    }

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const setTheme = useCallback((theme) => {
    if (theme === "system") {
      localStorage.removeItem("theme");
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setDarkMode(theme === "dark");
    }
  }, []);

  const themeValues = useMemo(() => ({
    darkMode,
    setDarkMode,
    toggleTheme,
    setTheme,
    theme: darkMode ? "dark" : "light",
  }), [darkMode, toggleTheme, setTheme]);

  return themeValues;
};

export default useTheme;