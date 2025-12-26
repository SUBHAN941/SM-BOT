import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCog,
  FaPalette,
  FaKeyboard,
  FaRobot,
  FaDownload,
  FaTrash,
  FaInfoCircle,
  FaCheck,
  FaSun,
  FaMoon,
  FaDesktop,
  FaRedo,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useChatContext } from "../../context/ChatContext";

// Toggle Switch Component
const ToggleSwitch = memo(({ enabled, onChange, label, description, darkMode }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1 pr-4">
      <p 
        className="text-sm font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
        {label}
      </p>
      {description && (
        <p 
          className="text-xs mt-0.5"
          style={{ color: 'var(--text-muted)' }}
        >
          {description}
        </p>
      )}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-purple-600" : ""
      }`}
      style={{
        backgroundColor: enabled ? undefined : 'var(--bg-tertiary)',
      }}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  </div>
));

ToggleSwitch.displayName = "ToggleSwitch";

// Slider Component
const Slider = memo(({ value, onChange, min, max, step, label, description }) => (
  <div className="py-3">
    <div className="flex items-center justify-between mb-2">
      <div>
        <p 
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </p>
        {description && (
          <p 
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {description}
          </p>
        )}
      </div>
      <span className="text-sm text-purple-500 font-medium">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
      style={{ backgroundColor: 'var(--bg-tertiary)' }}
    />
  </div>
));

Slider.displayName = "Slider";

// Select Component
const Select = memo(({ value, onChange, options, label }) => (
  <div className="py-3">
    <label 
      className="block text-sm font-medium mb-2"
      style={{ color: 'var(--text-primary)' }}
    >
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
      style={{
        backgroundColor: 'var(--bg-input)',
        borderColor: 'var(--border-primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-primary)',
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

Select.displayName = "Select";

// Theme Selector Component
const ThemeSelector = memo(({ currentTheme, onThemeChange, darkMode }) => {
  const themes = [
    { value: "dark", icon: FaMoon, label: "Dark" },
    { value: "light", icon: FaSun, label: "Light" },
    { value: "system", icon: FaDesktop, label: "System" },
  ];

  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("theme") ? currentTheme : "system"
  );

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <div className="py-3">
      <p 
        className="text-sm font-medium mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Theme
      </p>
      <div className="grid grid-cols-3 gap-2">
        {themes.map(({ value, icon: Icon, label }) => {
          const isActive = selectedTheme === value;
          return (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                isActive ? "border-purple-500 bg-purple-500/10" : ""
              }`}
              style={{
                backgroundColor: isActive ? undefined : 'var(--bg-tertiary)',
                borderColor: isActive ? undefined : 'var(--border-primary)',
              }}
            >
              <Icon 
                className={`w-5 h-5 ${isActive ? "text-purple-500" : ""}`}
                style={{ color: isActive ? undefined : 'var(--text-tertiary)' }}
              />
              <span 
                className={`text-xs font-medium ${isActive ? "text-purple-500" : ""}`}
                style={{ color: isActive ? undefined : 'var(--text-secondary)' }}
              >
                {label}
              </span>
              {isActive && (
                <FaCheck className="w-3 h-3 text-purple-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

ThemeSelector.displayName = "ThemeSelector";

// Tab Button Component
const TabButton = memo(({ active, onClick, icon, label, darkMode }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
      active ? "bg-purple-500/20 text-purple-500 border border-purple-500/30" : ""
    }`}
    style={{
      color: active ? undefined : 'var(--text-tertiary)',
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
));

TabButton.displayName = "TabButton";

// Main Settings Modal Component
export const SettingsModal = memo(({ isOpen, onClose }) => {
  const {
    settings,
    updateSetting,
    resetSettings,
    darkMode,
    setTheme,
    selectedModel,
    setSelectedModel,
    models,
    conversations,
    clearMessages,
  } = useChatContext();

  const [activeTab, setActiveTab] = useState("general");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const tabs = [
    { id: "general", icon: <FaCog className="w-4 h-4" />, label: "General" },
    { id: "appearance", icon: <FaPalette className="w-4 h-4" />, label: "Appearance" },
    { id: "model", icon: <FaRobot className="w-4 h-4" />, label: "AI Model" },
    { id: "shortcuts", icon: <FaKeyboard className="w-4 h-4" />, label: "Shortcuts" },
    { id: "data", icon: <FaDownload className="w-4 h-4" />, label: "Data" },
    { id: "about", icon: <FaInfoCircle className="w-4 h-4" />, label: "About" },
  ];

  const handleExportChats = useCallback(() => {
    const data = JSON.stringify(conversations, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [conversations]);

  const handleClearAllChats = useCallback(() => {
    clearMessages?.();
    setShowClearConfirm(false);
  }, [clearMessages]);

  const handleThemeChange = useCallback((theme) => {
    setTheme(theme);
  }, [setTheme]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[85vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FaCog className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Settings
                </h2>
                <p 
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Customize your experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
              }}
              aria-label="Close settings"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div 
              className="w-48 p-3 border-r space-y-1 overflow-y-auto"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                  label={tab.label}
                  darkMode={darkMode}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* General Tab */}
                  {activeTab === "general" && (
                    <div className="space-y-1">
                      <h3 
                        className="text-lg font-semibold mb-4"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        General Settings
                      </h3>
                      
                      <ToggleSwitch
                        enabled={settings?.streamingEnabled ?? true}
                        onChange={(v) => updateSetting("streamingEnabled", v)}
                        label="Streaming Responses"
                        description="Show AI responses as they're generated"
                        darkMode={darkMode}
                      />
                      
                      <ToggleSwitch
                        enabled={settings?.sendWithEnter ?? true}
                        onChange={(v) => updateSetting("sendWithEnter", v)}
                        label="Send with Enter"
                        description="Press Enter to send, Shift+Enter for new line"
                        darkMode={darkMode}
                      />
                      
                      <ToggleSwitch
                        enabled={settings?.showTimestamps ?? true}
                        onChange={(v) => updateSetting("showTimestamps", v)}
                        label="Show Timestamps"
                        description="Display time for each message"
                        darkMode={darkMode}
                      />
                      
                      <ToggleSwitch
                        enabled={settings?.autoScroll ?? true}
                        onChange={(v) => updateSetting("autoScroll", v)}
                        label="Auto-scroll"
                        description="Automatically scroll to new messages"
                        darkMode={darkMode}
                      />
                      
                      <ToggleSwitch
                        enabled={settings?.soundEnabled ?? false}
                        onChange={(v) => updateSetting("soundEnabled", v)}
                        label="Sound Effects"
                        description="Play sounds for notifications"
                        darkMode={darkMode}
                      />

                      <Select
                        value={settings?.language ?? "en"}
                        onChange={(v) => updateSetting("language", v)}
                        label="Language"
                        options={[
                          { value: "en", label: "English" },
                          { value: "es", label: "Español" },
                          { value: "fr", label: "Français" },
                          { value: "de", label: "Deutsch" },
                          { value: "zh", label: "中文" },
                          { value: "ja", label: "日本語" },
                        ]}
                      />
                    </div>
                  )}

                  {/* Appearance Tab */}
                  {activeTab === "appearance" && (
                    <div className="space-y-4">
                      <h3 
                        className="text-lg font-semibold mb-4"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Appearance
                      </h3>
                      
                      <ThemeSelector 
                        currentTheme={darkMode ? "dark" : "light"}
                        onThemeChange={handleThemeChange}
                        darkMode={darkMode}
                      />

                      <Select
                        value={settings?.fontSize ?? "medium"}
                        onChange={(v) => updateSetting("fontSize", v)}
                        label="Font Size"
                        options={[
                          { value: "small", label: "Small (14px)" },
                          { value: "medium", label: "Medium (16px)" },
                          { value: "large", label: "Large (18px)" },
                        ]}
                      />

                      <ToggleSwitch
                        enabled={settings?.compactMode ?? false}
                        onChange={(v) => updateSetting("compactMode", v)}
                        label="Compact Mode"
                        description="Reduce spacing between messages"
                        darkMode={darkMode}
                      />
                    </div>
                  )}

                  {/* AI Model Tab */}
                  {activeTab === "model" && (
                    <div className="space-y-4">
                      <h3 
                        className="text-lg font-semibold mb-4"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        AI Model Settings
                      </h3>
                      
                      <div className="py-3">
                        <label 
                          className="block text-sm font-medium mb-3"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Default Model
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(models || []).map((model) => (
                            <button
                              key={model.key}
                              onClick={() => setSelectedModel(model.key)}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                                selectedModel === model.key 
                                  ? "bg-purple-500/10 border-purple-500/50" 
                                  : ""
                              }`}
                              style={{
                                backgroundColor: selectedModel === model.key ? undefined : 'var(--bg-tertiary)',
                                borderColor: selectedModel === model.key ? undefined : 'var(--border-primary)',
                              }}
                            >
                              <div 
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  selectedModel === model.key ? "bg-purple-500" : ""
                                }`}
                                style={{
                                  backgroundColor: selectedModel === model.key ? undefined : 'var(--bg-secondary)',
                                }}
                              >
                                <HiSparkles className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-left flex-1">
                                <p 
                                  className="text-sm font-medium"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {model.name}
                                </p>
                                {model.description && (
                                  <p 
                                    className="text-xs"
                                    style={{ color: 'var(--text-muted)' }}
                                  >
                                    {model.description}
                                  </p>
                                )}
                              </div>
                              {selectedModel === model.key && (
                                <FaCheck className="w-4 h-4 text-purple-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Slider
                        value={settings?.temperature ?? 0.7}
                        onChange={(v) => updateSetting("temperature", v)}
                        min={0}
                        max={2}
                        step={0.1}
                        label="Temperature"
                        description="Higher values make output more creative"
                      />

                      <Slider
                        value={settings?.maxTokens ?? 2048}
                        onChange={(v) => updateSetting("maxTokens", v)}
                        min={256}
                        max={4096}
                        step={256}
                        label="Max Tokens"
                        description="Maximum length of AI responses"
                      />
                    </div>
                  )}

                  {/* Shortcuts Tab */}
                  {activeTab === "shortcuts" && (
                    <div className="space-y-4">
                      <h3 
                        className="text-lg font-semibold mb-4"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Keyboard Shortcuts
                      </h3>
                      
                      <div className="space-y-2">
                        {[
                          { keys: ["Enter"], action: "Send message" },
                          { keys: ["Shift", "Enter"], action: "New line" },
                          { keys: ["Ctrl", "N"], action: "New conversation" },
                          { keys: ["Ctrl", "B"], action: "Toggle sidebar" },
                          { keys: ["Ctrl", "/"], action: "Focus input" },
                          { keys: ["Ctrl", ","], action: "Open settings" },
                          { keys: ["Esc"], action: "Close modal" },
                          { keys: ["Ctrl", "C"], action: "Copy selected text" },
                        ].map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 px-3 rounded-lg"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                          >
                            <span 
                              className="text-sm"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {shortcut.action}
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
                                    <span 
                                      className="text-xs"
                                      style={{ color: 'var(--text-muted)' }}
                                    >
                                      +
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Tab */}
                  {activeTab === "data" && (
                    <div className="space-y-4">
                      <h3 
                        className="text-lg font-semibold mb-4"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Data & Privacy
                      </h3>
                      
                      {/* Export */}
                      <div 
                        className="p-4 rounded-xl border"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          borderColor: 'var(--border-primary)',
                        }}
                      >
                        <h4 
                          className="text-sm font-medium mb-2"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Export Conversations
                        </h4>
                        <p 
                          className="text-xs mb-3"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Download all your conversations as a JSON file
                        </p>
                        <button
                          onClick={handleExportChats}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                        >
                          <FaDownload className="w-4 h-4" />
                          Export Data
                        </button>
                      </div>

                      {/* Clear Data */}
                      <div 
                        className="p-4 rounded-xl border border-red-500/20"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                      >
                        <h4 className="text-sm font-medium text-red-500 mb-2">
                          Danger Zone
                        </h4>
                        <p 
                          className="text-xs mb-3"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Clear all conversations. This action cannot be undone.
                        </p>
                        
                        {showClearConfirm ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleClearAllChats}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => setShowClearConfirm(false)}
                              className="px-4 py-2 text-sm rounded-lg transition-colors"
                              style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-primary)',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowClearConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 text-red-500 text-sm rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                            Clear All Chats
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* About Tab */}
                  {activeTab === "about" && (
                    <div className="space-y-4">
                      <h3 
                        className="text-lg font-semibold mb-4"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        About
                      </h3>
                      
                      <div className="text-center py-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <HiSparkles className="w-10 h-10 text-white" />
                        </div>
                        <h4 
                          className="text-xl font-bold mb-1"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          AI Chat
                        </h4>
                        <p 
                          className="text-sm mb-4"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Version 1.0.0
                        </p>
                        <p 
                          className="text-sm max-w-sm mx-auto"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          A modern AI chat interface powered by multiple language models.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        {[
                          { label: "Conversations", value: conversations?.length || 0 },
                          { label: "Models Available", value: models?.length || 0 },
                          { label: "Theme", value: darkMode ? "Dark" : "Light" },
                          { label: "Language", value: (settings?.language || "en").toUpperCase() },
                        ].map((stat, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-xl text-center"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                          >
                            <p className="text-2xl font-bold text-purple-500">{stat.value}</p>
                            <p 
                              className="text-xs"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="flex items-center justify-between p-4 border-t"
            style={{
              borderColor: 'var(--border-primary)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <FaRedo className="w-4 h-4" />
              Reset to Defaults
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Done
            </button>
          </div>

          {/* Reset Confirmation */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="p-6 rounded-xl border max-w-sm mx-4"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  <h4 
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Reset Settings?
                  </h4>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    This will reset all settings to their default values.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        resetSettings?.();
                        setShowResetConfirm(false);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-4 py-2 text-sm rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

SettingsModal.displayName = "SettingsModal";

export default SettingsModal;