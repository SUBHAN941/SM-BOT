import React, { memo } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

// Full Toggle with track
export const ThemeToggle = memo(() => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #1e293b, #0f172a)"
          : "linear-gradient(135deg, #bfdbfe, #93c5fd)",
        borderColor: darkMode ? '#374151' : '#93c5fd',
      }}
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
      role="switch"
      aria-checked={darkMode}
    >
      {/* Stars for dark mode */}
      <AnimatePresence>
        {darkMode && (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute w-1 h-1 bg-white rounded-full top-1.5 left-2"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute w-0.5 h-0.5 bg-white rounded-full top-3 left-4"
            />
          </>
        )}
      </AnimatePresence>

      {/* Clouds for light mode */}
      <AnimatePresence>
        {!darkMode && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.7, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute top-1.5 right-2 w-2 h-1 bg-white rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.5, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: 0.05 }}
              className="absolute top-3 right-4 w-1.5 h-0.5 bg-white rounded-full"
            />
          </>
        )}
      </AnimatePresence>

      {/* Toggle Circle */}
      <motion.div
        animate={{ x: darkMode ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative w-5 h-5 rounded-full shadow-lg flex items-center justify-center"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #6366f1, #4f46e5)"
            : "linear-gradient(135deg, #fbbf24, #f59e0b)",
          boxShadow: darkMode
            ? "0 2px 8px rgba(99, 102, 241, 0.4)"
            : "0 2px 8px rgba(251, 191, 36, 0.4)",
        }}
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaMoon className="w-2.5 h-2.5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaSun className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

// Mini version - icon button
export const ThemeToggleMini = memo(() => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-all duration-200 border"
      style={{
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(254, 243, 199, 0.8)',
        borderColor: darkMode ? 'var(--border-primary)' : '#fcd34d',
        color: darkMode ? '#fbbf24' : '#d97706',
      }}
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <FaSun className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <FaMoon className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

ThemeToggleMini.displayName = "ThemeToggleMini";

// Button version with label
export const ThemeToggleButton = memo(() => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #6366f1, #4f46e5)"
            : "linear-gradient(135deg, #fbbf24, #f59e0b)",
        }}
      >
        {darkMode ? (
          <FaMoon className="w-4 h-4 text-white" />
        ) : (
          <FaSun className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="text-left">
        <p 
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {darkMode ? "Dark Mode" : "Light Mode"}
        </p>
        <p 
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          Click to switch
        </p>
      </div>
    </motion.button>
  );
});

ThemeToggleButton.displayName = "ThemeToggleButton";

export default ThemeToggle;