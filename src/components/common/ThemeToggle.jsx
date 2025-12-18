import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useChatContext } from "../../context/ChatContext";

export const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 focus:outline-none transition-all duration-300"
      style={{
        background: darkMode 
          ? "linear-gradient(135deg, #1e3a5f, #0f172a)" 
          : "linear-gradient(135deg, #bfdbfe, #dbeafe)",
        boxShadow: darkMode 
          ? "inset 0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(59, 130, 246, 0.3)" 
          : "inset 0 2px 4px rgba(0,0,0,0.1)",
      }}
      aria-label="Toggle theme"
    >
      {/* Stars for dark mode */}
      {darkMode && (
        <>
          <span className="absolute w-1 h-1 bg-white rounded-full top-2 left-3 opacity-60"></span>
          <span className="absolute w-0.5 h-0.5 bg-white rounded-full top-4 left-5 opacity-40"></span>
          <span className="absolute w-1 h-1 bg-blue-300 rounded-full top-1.5 left-8 opacity-50"></span>
        </>
      )}
      
      {/* Toggle Circle */}
      <div
        className="w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        style={{
          transform: darkMode ? "translateX(32px)" : "translateX(0)",
          background: darkMode 
            ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" 
            : "linear-gradient(135deg, #fbbf24, #f59e0b)",
          boxShadow: darkMode
            ? "0 0 10px rgba(59, 130, 246, 0.5)"
            : "0 0 10px rgba(251, 191, 36, 0.5)",
        }}
      >
        {darkMode ? (
          <FaMoon className="w-3 h-3 text-white" />
        ) : (
          <FaSun className="w-3 h-3 text-white" />
        )}
      </div>
    </button>
  );
};

// Simple Button Version
export const ThemeToggleButton = () => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl transition-all duration-300"
      style={{
        backgroundColor: darkMode ? "var(--bg-tertiary)" : "var(--bg-secondary)",
        boxShadow: darkMode ? "0 0 15px rgba(59, 130, 246, 0.2)" : "none",
      }}
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <FaSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FaMoon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );
};