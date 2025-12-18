import { useState, useEffect } from "react";

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return { darkMode, setDarkMode, toggleTheme };
};