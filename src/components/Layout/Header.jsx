import React, { useState } from "react";
import { 
  FaBars, 
  FaRobot, 
  FaTimes, 
  FaCog, 
  FaBell,
  FaKeyboard,
  FaQuestionCircle
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";
import { ModelSelector } from "../common/ModelSelector";
import { ThemeToggleMini } from "../common/ThemeToggle";

export const Header = () => {
  const { sidebarOpen, setSidebarOpen, isLoading } = useChatContext();
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <header className="relative h-14 flex-shrink-0 z-40">
        {/* Background with blur */}
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50" />
        
        {/* Gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-4">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`
                relative p-2 rounded-xl transition-all duration-200
                ${sidebarOpen 
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" 
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }
              `}
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <AnimatePresence mode="wait">
                {sidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FaTimes className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FaBars className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-700/50 hidden sm:block" />

            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated Logo */}
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-50" />
                
                {/* Logo container */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <FaRobot className="w-4.5 h-4.5 text-white" />
                  
                  {/* Sparkle decoration */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <HiSparkles className="w-3 h-3 text-yellow-300" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Brand name */}
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  AI Chat
                </h1>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center - Status indicator (visible when loading) */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full"
                />
                <span className="text-xs text-purple-300 font-medium">Processing...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Keyboard shortcuts button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShortcuts(true)}
              className="hidden md:flex p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
              title="Keyboard shortcuts"
            >
              <FaKeyboard className="w-4 h-4" />
            </motion.button>

            {/* Theme toggle */}
            <ThemeToggleMini />

            {/* Divider */}
            <div className="w-px h-6 bg-gray-700/50" />

            {/* Model Selector */}
            <ModelSelector />
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <ShortcutsModal onClose={() => setShowShortcuts(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

// Keyboard Shortcuts Modal Component
const ShortcutsModal = ({ onClose }) => {
  const shortcuts = [
    { keys: ["Enter"], description: "Send message" },
    { keys: ["Shift", "Enter"], description: "New line" },
    { keys: ["Ctrl", "N"], description: "New conversation" },
    { keys: ["Ctrl", "B"], description: "Toggle sidebar" },
    { keys: ["Ctrl", "/"], description: "Focus input" },
    { keys: ["Esc"], description: "Close modal" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <FaKeyboard className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Shortcuts list */}
        <div className="p-4 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-gray-300">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    <kbd className="px-2 py-1 bg-gray-700/80 rounded-md text-xs font-medium text-gray-300 border border-gray-600/50">
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span className="text-gray-500 text-xs">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Esc</kbd> to close
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};