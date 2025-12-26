import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { FaPaperPlane, FaStop, FaImage } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

// Mode Button Component
const ModeButton = memo(({ active, onClick, icon, label, gradient, darkMode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5`}
    style={{
      color: active ? '#ffffff' : (darkMode ? '#9ca3af' : '#6b7280'),
    }}
  >
    {active && (
      <motion.div
        layoutId="mode-indicator"
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-md`}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative flex items-center gap-1.5">
      {icon}
      {label}
    </span>
  </button>
));

ModeButton.displayName = 'ModeButton';

export const ChatInput = memo(() => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("chat");
  const [isFocused, setIsFocused] = useState(false);

  const { 
    sendMessage, 
    isLoading, 
    isStreaming,
    stopStreaming,
    selectedModel, 
    refreshConversations,
    darkMode,
    settings 
  } = useChatContext();
  
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "24px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    let messageText = input.trim();
    if (mode === "image" && !messageText.toLowerCase().startsWith("/image")) {
      messageText = "/image " + messageText;
    }

    setInput("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }

    await sendMessage(messageText, selectedModel, settings?.streamingEnabled ?? true);
    refreshConversations();
  }, [input, isLoading, mode, sendMessage, selectedModel, refreshConversations, settings?.streamingEnabled]);

  const handleKeyDown = useCallback((e) => {
    if (settings?.sendWithEnter !== false) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  }, [handleSubmit, settings?.sendWithEnter]);

  const handleStop = useCallback(() => {
    stopStreaming?.();
  }, [stopStreaming]);

  const isDisabled = isLoading && !isStreaming;
  const canSend = input.trim() && !isDisabled;

  // Dynamic styles based on theme
  const containerStyle = {
    backgroundColor: isFocused 
      ? (darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)')
      : (darkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(249, 250, 251, 0.9)'),
    borderColor: isFocused
      ? (mode === "image" ? 'rgba(168, 85, 247, 0.5)' : 'rgba(59, 130, 246, 0.5)')
      : 'var(--border-primary)',
    boxShadow: isFocused
      ? (mode === "image" 
          ? '0 4px 20px rgba(168, 85, 247, 0.15)' 
          : '0 4px 20px rgba(59, 130, 246, 0.15)')
      : 'none',
  };

  const modeToggleStyle = {
    backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(243, 244, 246, 0.9)',
    borderColor: 'var(--border-primary)',
  };

  return (
    <div className="p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-3">
          
          {/* Mode Toggle */}
          <div className="flex items-center justify-between">
            <div 
              className="inline-flex items-center p-0.5 rounded-lg border"
              style={modeToggleStyle}
            >
              <ModeButton
                active={mode === "chat"}
                onClick={() => setMode("chat")}
                icon={<HiSparkles className="w-3 h-3" />}
                label="Chat"
                gradient="from-blue-600 to-blue-500"
                darkMode={darkMode}
              />
              <ModeButton
                active={mode === "image"}
                onClick={() => setMode("image")}
                icon={<FaImage className="w-3 h-3" />}
                label="Image"
                gradient="from-purple-600 to-pink-500"
                darkMode={darkMode}
              />
            </div>

            {/* Keyboard hints */}
            <p 
              className="hidden md:flex items-center gap-2 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              <kbd 
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  color: 'var(--text-tertiary)' 
                }}
              >
                Enter
              </kbd>
              <span>send</span>
              <kbd 
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  color: 'var(--text-tertiary)' 
                }}
              >
                Shift+Enter
              </kbd>
              <span>new line</span>
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit}>
            <div
              className="relative flex items-end gap-2 p-2 rounded-xl border transition-all duration-200"
              style={containerStyle}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isDisabled}
                rows={1}
                placeholder={
                  mode === "image"
                    ? "Describe the image you want to generate..."
                    : "Message AI Assistant..."
                }
                className="flex-1 bg-transparent text-sm resize-none focus:outline-none min-h-[24px] max-h-[200px] py-1.5 px-2 leading-normal custom-scrollbar"
                style={{
                  color: 'var(--text-primary)',
                }}
                aria-label="Message input"
              />

              {/* Send/Stop Button */}
              <AnimatePresence mode="wait">
                {isStreaming ? (
                  <motion.button
                    key="stop"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    type="button"
                    onClick={handleStop}
                    className="flex-shrink-0 p-2.5 rounded-lg bg-red-600 hover:bg-red-500 transition-colors"
                    aria-label="Stop generating"
                  >
                    <FaStop className="w-4 h-4 text-white" />
                  </motion.button>
                ) : (
                  <motion.button
                    key="send"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    type="submit"
                    disabled={!canSend}
                    className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                      canSend
                        ? mode === "image"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25"
                          : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25"
                        : ""
                    }`}
                    style={{
                      backgroundColor: !canSend ? 'var(--bg-tertiary)' : undefined,
                    }}
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : mode === "image" ? (
                      <FaImage className="w-4 h-4 text-white" />
                    ) : (
                      <FaPaperPlane className="w-4 h-4 text-white" />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Footer text */}
          <p 
            className="text-center text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;