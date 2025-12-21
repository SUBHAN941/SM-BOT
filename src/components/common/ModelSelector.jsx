import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck, FaRobot, FaBrain, FaMicrochip } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

// Model icons mapping
const modelIcons = {
  "gpt-4": FaBrain,
  "gpt-3.5": FaBrain,
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
  "claude": "from-orange-500 to-amber-600",
  "llama": "from-blue-500 to-indigo-600",
  "mixtral": "from-purple-500 to-pink-600",
  "gemini": "from-cyan-500 to-blue-600",
  "default": "from-gray-500 to-gray-600",
};

export const ModelSelector = () => {
  const { models, selectedModel, setSelectedModel } = useChatContext();
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

  // Get current model info
  const currentModel = models.find((m) => m.key === selectedModel) || models[0];
  
  const getModelIcon = (modelKey) => {
    const key = Object.keys(modelIcons).find((k) => modelKey?.toLowerCase().includes(k));
    return modelIcons[key] || modelIcons.default;
  };

  const getModelColor = (modelKey) => {
    const key = Object.keys(modelColors).find((k) => modelKey?.toLowerCase().includes(k));
    return modelColors[key] || modelColors.default;
  };

  const handleSelect = (modelKey) => {
    setSelectedModel(modelKey);
    setIsOpen(false);
  };

  const CurrentIcon = getModelIcon(selectedModel);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative flex items-center gap-2 px-3 py-2 
          bg-gray-800/80 backdrop-blur-sm 
          border border-gray-700/50 
          rounded-xl 
          text-sm text-white 
          cursor-pointer 
          transition-all duration-200
          hover:bg-gray-700/80 hover:border-gray-600/50
          focus:outline-none focus:ring-2 focus:ring-purple-500/50
          ${isOpen ? "ring-2 ring-purple-500/50 border-purple-500/50" : ""}
        `}
      >
        {/* Model icon with gradient background */}
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getModelColor(selectedModel)} p-1 flex items-center justify-center`}>
          <CurrentIcon className="w-3.5 h-3.5 text-white" />
        </div>

        {/* Model name */}
        <span className="font-medium max-w-[100px] truncate">
          {currentModel?.name || "Select Model"}
        </span>

        {/* Chevron with rotation animation */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="w-3 h-3 text-gray-400" />
        </motion.div>

        {/* Active indicator dot */}
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-gray-900">
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
            className="absolute top-full left-0 mt-2 w-64 z-50"
          >
            {/* Dropdown container */}
            <div className="bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="px-3 py-2 border-b border-gray-700/50">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Select AI Model
                </p>
              </div>

              {/* Model list */}
              <div className="p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                {models.map((model, index) => {
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
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-150
                        ${isSelected 
                          ? "bg-purple-500/20 border border-purple-500/30" 
                          : "hover:bg-gray-700/50 border border-transparent"
                        }
                      `}
                    >
                      {/* Model icon */}
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} p-1.5 flex items-center justify-center shadow-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>

                      {/* Model info */}
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-200"}`}>
                          {model.name}
                        </p>
                        {model.description && (
                          <p className="text-xs text-gray-500 truncate">
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
              <div className="px-3 py-2 border-t border-gray-700/50 bg-gray-900/50">
                <p className="text-xs text-gray-500 text-center">
                  <HiSparkles className="inline w-3 h-3 mr-1 text-purple-400" />
                  Models have different capabilities
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Compact version for mobile/sidebar
export const ModelSelectorCompact = () => {
  const { models, selectedModel, setSelectedModel } = useChatContext();

  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="
          w-full appearance-none 
          bg-gray-800/80 backdrop-blur-sm
          border border-gray-700/50 
          rounded-xl px-4 py-2.5 pr-10 
          text-white text-sm font-medium
          cursor-pointer 
          transition-all duration-200
          hover:bg-gray-700/80 hover:border-gray-600/50
          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
        "
      >
        {models.map((model) => (
          <option key={model.key} value={model.key} className="bg-gray-800">
            {model.name}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
        <div className="w-px h-4 bg-gray-700" />
        <FaChevronDown className="w-3 h-3 text-gray-400" />
      </div>
    </div>
  );
};