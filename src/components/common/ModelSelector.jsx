import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { FaChevronDown, FaCheck, FaRobot, FaBrain, FaMicrochip } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

// Model icons mapping
const modelIcons = {
  "gpt-4": FaBrain,
  "gpt-3.5": FaBrain,
  "gpt": FaBrain,
  "claude": HiSparkles,
  "llama": FaRobot,
  "mixtral": FaMicrochip,
  "gemini": HiSparkles,
  "default": FaRobot,
};

// Model colors mapping
const modelColors = {
  "gpt-4": "from-green-500 to-emerald-600",
  "gpt-3.5": "from-green-400 to-emerald-500",
  "gpt": "from-green-400 to-emerald-500",
  "claude": "from-orange-500 to-amber-600",
  "llama": "from-blue-500 to-indigo-600",
  "mixtral": "from-purple-500 to-pink-600",
  "gemini": "from-cyan-500 to-blue-600",
  "default": "from-gray-500 to-gray-600",
};

const getModelIcon = (modelKey) => {
  if (!modelKey) return modelIcons.default;
  const key = Object.keys(modelIcons).find((k) => modelKey.toLowerCase().includes(k));
  return modelIcons[key] || modelIcons.default;
};

const getModelColor = (modelKey) => {
  if (!modelKey) return modelColors.default;
  const key = Object.keys(modelColors).find((k) => modelKey.toLowerCase().includes(k));
  return modelColors[key] || modelColors.default;
};

export const ModelSelector = memo(() => {
  const { models, selectedModel, setSelectedModel, darkMode } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const currentModel = models?.find((m) => m.key === selectedModel) || models?.[0];
  const CurrentIcon = getModelIcon(selectedModel);

  const handleSelect = useCallback((modelKey) => {
    setSelectedModel(modelKey);
    setIsOpen(false);
  }, [setSelectedModel]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleDropdown}
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer transition-all duration-200 border"
        style={{
          backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isOpen 
            ? 'var(--accent-primary)' 
            : 'var(--border-primary)',
          boxShadow: isOpen ? '0 0 0 2px rgba(139, 92, 246, 0.2)' : 'none',
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select AI model"
      >
        {/* Model icon with gradient background */}
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getModelColor(selectedModel)} p-1 flex items-center justify-center`}>
          <CurrentIcon className="w-3.5 h-3.5 text-white" />
        </div>

        {/* Model name */}
        <span 
          className="font-medium max-w-[100px] truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {currentModel?.name || "Select Model"}
        </span>

        {/* Chevron with rotation animation */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown 
            className="w-3 h-3" 
            style={{ color: 'var(--text-tertiary)' }}
          />
        </motion.div>

        {/* Active indicator dot */}
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full ring-2"
          style={{ ringColor: darkMode ? '#111827' : '#ffffff' }}
        >
          <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-72 z-50 rounded-xl overflow-hidden border shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              boxShadow: darkMode 
                ? '0 20px 40px rgba(0, 0, 0, 0.5)' 
                : '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
            role="listbox"
          >
            {/* Header */}
            <div 
              className="px-3 py-2 border-b"
              style={{ 
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <p 
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Select AI Model
              </p>
            </div>

            {/* Model list */}
            <div className="p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {(models || []).map((model, index) => {
                const Icon = getModelIcon(model.key);
                const isSelected = model.key === selectedModel;
                const colorClass = getModelColor(model.key);

                return (
                  <motion.button
                    key={model.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelect(model.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 border"
                    style={{
                      backgroundColor: isSelected 
                        ? 'rgba(139, 92, 246, 0.1)' 
                        : 'transparent',
                      borderColor: isSelected 
                        ? 'rgba(139, 92, 246, 0.3)' 
                        : 'transparent',
                    }}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {/* Model icon */}
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} p-1.5 flex items-center justify-center shadow-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    {/* Model info */}
                    <div className="flex-1 text-left">
                      <p 
                        className="text-sm font-medium"
                        style={{ 
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' 
                        }}
                      >
                        {model.name}
                      </p>
                      {model.description && (
                        <p 
                          className="text-xs truncate"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {model.description}
                        </p>
                      )}
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"
                      >
                        <FaCheck className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div 
              className="px-3 py-2 border-t"
              style={{ 
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <p 
                className="text-xs text-center flex items-center justify-center gap-1"
                style={{ color: 'var(--text-muted)' }}
              >
                <HiSparkles className="w-3 h-3 text-purple-500" />
                Models have different capabilities
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ModelSelector.displayName = "ModelSelector";

// Compact version for mobile/sidebar
export const ModelSelectorCompact = memo(() => {
  const { models, selectedModel, setSelectedModel, darkMode } = useChatContext();

  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full appearance-none rounded-xl px-4 py-2.5 pr-10 text-sm font-medium cursor-pointer transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
        aria-label="Select AI model"
      >
        {(models || []).map((model) => (
          <option 
            key={model.key} 
            value={model.key}
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          >
            {model.name}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
        <div 
          className="w-px h-4"
          style={{ backgroundColor: 'var(--border-primary)' }}
        />
        <FaChevronDown 
          className="w-3 h-3"
          style={{ color: 'var(--text-tertiary)' }}
        />
      </div>
    </div>
  );
});

ModelSelectorCompact.displayName = "ModelSelectorCompact";

export default ModelSelector;