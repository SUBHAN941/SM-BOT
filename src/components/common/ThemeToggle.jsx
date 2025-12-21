import React from "react";
import { FaSun, FaMoon, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

export const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-shadow duration-300"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #1e293b, #0f172a)"
          : "linear-gradient(135deg, #93c5fd, #bfdbfe)",
      }}
      aria-label="Toggle theme"
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          darkMode ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), 0 0 20px rgba(99, 102, 241, 0.2)",
        }}
      />

      {/* Stars for dark mode */}
      <AnimatePresence>
        {darkMode && (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute w-1 h-1 bg-white rounded-full top-1.5 left-2.5"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute w-0.5 h-0.5 bg-white rounded-full top-3.5 left-4"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute w-1 h-1 bg-blue-300 rounded-full top-1 left-7"
            >
              <span className="absolute inset-0 bg-blue-300 rounded-full animate-ping opacity-50" />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.25 }}
              className="absolute w-0.5 h-0.5 bg-purple-300 rounded-full top-5 left-3"
            />
          </>
        )}
      </AnimatePresence>

      {/* Clouds for light mode */}
      <AnimatePresence>
        {!darkMode && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.6, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-1.5 right-2 w-3 h-1.5 bg-white rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 0.1 }}
              className="absolute top-3.5 right-4 w-2 h-1 bg-white rounded-full"
            />
          </>
        )}
      </AnimatePresence>

      {/* Toggle Circle */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative w-6 h-6 rounded-full shadow-lg flex items-center justify-center"
        style={{
          marginLeft: darkMode ? "32px" : "0px",
          background: darkMode
            ? "linear-gradient(135deg, #6366f1, #4f46e5)"
            : "linear-gradient(135deg, #fbbf24, #f59e0b)",
          boxShadow: darkMode
            ? "0 0 15px rgba(99, 102, 241, 0.6), 0 2px 4px rgba(0,0,0,0.3)"
            : "0 0 15px rgba(251, 191, 36, 0.6), 0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaMoon className="w-3 h-3 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaSun className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sun rays animation */}
        {!darkMode && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-1 bg-yellow-300/50 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 45}deg) translateY(-10px)`,
                  transformOrigin: "center center",
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
};

// Icon Button Version
export const ThemeToggleButton = () => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`
        relative p-2.5 rounded-xl 
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-purple-500/50
        ${darkMode 
          ? "bg-gray-800/80 hover:bg-gray-700/80" 
          : "bg-blue-100 hover:bg-blue-200"
        }
      `}
      style={{
        boxShadow: darkMode 
          ? "0 0 20px rgba(99, 102, 241, 0.15)" 
          : "0 0 20px rgba(251, 191, 36, 0.2)",
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaSun className="w-5 h-5 text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaMoon className="w-5 h-5 text-indigo-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Mini version for tight spaces
export const ThemeToggleMini = () => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`
        p-1.5 rounded-lg transition-colors duration-200
        ${darkMode 
          ? "bg-gray-700/50 hover:bg-gray-600/50 text-yellow-400" 
          : "bg-blue-100 hover:bg-blue-200 text-indigo-600"
        }
      `}
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <FaSun className="w-4 h-4" />
      ) : (
        <FaMoon className="w-4 h-4" />
      )}
    </motion.button>
  );
};

// Fancy animated version with label
export const ThemeToggleFancy = () => {
  const { darkMode, toggleTheme } = useChatContext();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      className={`
        relative flex items-center gap-3 px-4 py-2.5 rounded-xl
        border transition-all duration-300
        ${darkMode
          ? "bg-gray-800/80 border-gray-700/50 hover:border-purple-500/50"
          : "bg-white border-gray-200 hover:border-yellow-400/50"
        }
      `}
    >
      {/* Icon container with animation */}
      <div
        className={`
          relative w-10 h-10 rounded-xl flex items-center justify-center
          ${darkMode
            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
            : "bg-gradient-to-br from-yellow-400 to-orange-500"
          }
        `}
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative"
            >
              <FaMoon className="w-5 h-5 text-white" />
              <HiSparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <FaSun className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      <div className="text-left">
        <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
          {darkMode ? "Dark Mode" : "Light Mode"}
        </p>
        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {darkMode ? "Click for light" : "Click for dark"}
        </p>
      </div>

      {/* Toggle indicator */}
      <div className={`w-2 h-2 rounded-full ${darkMode ? "bg-purple-400" : "bg-yellow-400"}`}>
        <span className={`block w-full h-full rounded-full animate-ping ${darkMode ? "bg-purple-400" : "bg-yellow-400"} opacity-75`} />
      </div>
    </motion.button>
  );
};