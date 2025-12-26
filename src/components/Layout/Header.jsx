import React, { useState, memo, useCallback } from "react";
import { 
  FaBars, 
  FaRobot, 
  FaTimes, 
  FaCog, 
  FaKeyboard
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";
import { ModelSelector } from "../common/ModelSelector";
import { ThemeToggleMini } from "../common/ThemeToggle";

export const Header = memo(() => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    isLoading,
    setSettingsOpen,
    darkMode
  } = useChatContext();
  
  const [showShortcuts, setShowShortcuts] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, [setSidebarOpen]);

  const openSettings = useCallback(() => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);

  return (
    <>
      <header 
        className="relative h-14 flex-shrink-0 z-40 border-b backdrop-blur-xl transition-colors duration-300"
        style={{
          backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: 'var(--border-primary)',
        }}
      >
        {/* Gradient accent line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, var(--accent-primary), transparent)',
            opacity: 0.5,
          }}
        />

        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-4">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className={`p-2 rounded-xl transition-all duration-200 ${
                sidebarOpen ? "bg-purple-500/20 text-purple-500" : ""
              }`}
              style={{
                backgroundColor: sidebarOpen ? undefined : 'var(--bg-tertiary)',
                color: sidebarOpen ? undefined : 'var(--text-tertiary)',
              }}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <AnimatePresence mode="wait">
                {sidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <FaTimes className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <FaBars className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Divider */}
            <div 
              className="w-px h-6 hidden sm:block"
              style={{ backgroundColor: 'var(--border-primary)' }}
            />

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-50" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FaRobot className="w-4 h-4 text-white" />
                  <HiSparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
                </div>
              </div>

              <div className="hidden sm:block">
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  AI Chat
                </h1>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span 
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Loading indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full"
                />
                <span className="text-xs text-purple-500 font-medium">Processing...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Keyboard shortcuts */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShortcuts(true)}
              className="hidden md:flex p-2 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
              }}
              aria-label="Keyboard shortcuts"
            >
              <FaKeyboard className="w-4 h-4" />
            </motion.button>

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openSettings}
              className="p-2 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
              }}
              aria-label="Open settings"
            >
              <FaCog className="w-4 h-4" />
            </motion.button>

            {/* Theme toggle */}
            <ThemeToggleMini />

            {/* Divider */}
            <div 
              className="w-px h-6"
              style={{ backgroundColor: 'var(--border-primary)' }}
            />

            {/* Model Selector */}
            <ModelSelector />
          </div>
        </div>
      </header>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <ShortcutsModal onClose={() => setShowShortcuts(false)} darkMode={darkMode} />
        )}
      </AnimatePresence>
    </>
  );
});

// Shortcuts Modal Component
const ShortcutsModal = memo(({ onClose, darkMode }) => {
  const shortcuts = [
    { keys: ["Enter"], description: "Send message" },
    { keys: ["Shift", "Enter"], description: "New line" },
    { keys: ["Ctrl", "N"], description: "New conversation" },
    { keys: ["Ctrl", "B"], description: "Toggle sidebar" },
    { keys: ["Ctrl", "/"], description: "Focus input" },
    { keys: ["Ctrl", ","], description: "Open settings" },
    { keys: ["Esc"], description: "Close modal" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center gap-2">
            <FaKeyboard className="w-5 h-5 text-purple-500" />
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-tertiary)',
            }}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <span 
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    <kbd 
                      className="px-2 py-1 rounded text-xs font-medium border"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span style={{ color: 'var(--text-muted)' }}>+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div 
          className="p-4 border-t"
          style={{
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <p 
            className="text-xs text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Press <kbd 
              className="px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
              }}
            >Esc</kbd> to close
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
});

ShortcutsModal.displayName = "ShortcutsModal";
Header.displayName = "Header";

export default Header;