import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { ChatMessage } from "./ChatMessage";
import { useChatContext } from "../../context/ChatContext";

// Date separator component
const DateSeparator = memo(({ date, darkMode }) => (
  <div className="flex items-center justify-center py-4">
    <div className="flex items-center gap-3">
      <div 
        className="h-px w-16"
        style={{ 
          background: `linear-gradient(to right, transparent, var(--border-primary))` 
        }}
      />
      <span 
        className="text-xs font-medium px-3 py-1 rounded-full border"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-muted)',
        }}
      >
        {date}
      </span>
      <div 
        className="h-px w-16"
        style={{ 
          background: `linear-gradient(to left, transparent, var(--border-primary))` 
        }}
      />
    </div>
  </div>
));

DateSeparator.displayName = 'DateSeparator';

// Scroll to bottom button
const ScrollButton = memo(({ onClick, newCount, darkMode }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    onClick={onClick}
    className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-xl transition-colors"
    style={{
      backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: 'var(--border-primary)',
      boxShadow: darkMode 
        ? '0 10px 25px rgba(0, 0, 0, 0.4)' 
        : '0 10px 25px rgba(0, 0, 0, 0.1)',
    }}
    aria-label="Scroll to bottom"
  >
    <FaArrowDown 
      className="w-3.5 h-3.5"
      style={{ color: 'var(--text-secondary)' }}
    />
    {newCount > 0 && (
      <span className="text-xs font-medium text-purple-500">
        {newCount} new
      </span>
    )}
  </motion.button>
));

ScrollButton.displayName = 'ScrollButton';

// Typing indicator
const TypingIndicator = memo(({ darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-4 px-4 py-6"
  >
    <div className="max-w-4xl mx-auto flex items-center gap-4 w-full">
      <div className="relative flex-shrink-0">
        <div className="absolute -inset-1 bg-purple-500/30 rounded-full blur-md animate-pulse" />
        <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <HiSparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      <div 
        className="flex items-center gap-1 px-4 py-3 rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-2 h-2 bg-purple-500 rounded-full"
          />
        ))}
        <span 
          className="ml-2 text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          AI is thinking...
        </span>
      </div>
    </div>
  </motion.div>
));

TypingIndicator.displayName = 'TypingIndicator';

// Main MessageList Component
export const MessageList = memo(() => {
  const { 
    messages, 
    isLoading, 
    regenerateMessage, 
    editMessage, 
    selectedModel,
    darkMode 
  } = useChatContext();
  
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Check scroll position
  const checkScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceFromBottom < 100;

    setIsNearBottom(nearBottom);
    setShowScrollButton(!nearBottom && messages.length > 3);

    if (nearBottom) {
      setNewMessageCount(0);
    }
  }, [messages.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (messages.length > 0) {
      setNewMessageCount((prev) => prev + 1);
    }
  }, [messages.length, isNearBottom]);

  // Scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition, { passive: true });
    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, [checkScrollPosition]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageCount(0);
  }, []);

  // Handle regenerate
  const handleRegenerate = useCallback((messageId) => {
    regenerateMessage?.(messageId, selectedModel);
  }, [regenerateMessage, selectedModel]);

  // Handle edit
  const handleEdit = useCallback((messageId, content) => {
    editMessage?.(messageId, content, selectedModel);
  }, [editMessage, selectedModel]);

  // Get date label
  const getDateLabel = useCallback((timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Check if should show date separator
  const shouldShowDate = useCallback((current, previous) => {
    if (!previous) return true;
    return getDateLabel(current.timestamp) !== getDateLabel(previous.timestamp);
  }, [getDateLabel]);

  if (messages.length === 0) return null;

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Fade gradients */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, var(--bg-primary), transparent)`,
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--bg-primary), transparent)`,
        }}
      />

      {/* Messages container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scroll-smooth custom-scrollbar"
      >
        <div className="py-4">
          {/* Conversation start */}
          <div className="flex items-center justify-center py-6">
            <div 
              className="flex items-center gap-3 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <HiSparkles className="w-4 h-4 text-white" />
              </div>
              <span 
                className="text-sm"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Conversation started
                {messages[0]?.timestamp && (
                  <span style={{ color: 'var(--text-muted)' }}>
                    {" "}• {getDateLabel(messages[0].timestamp)}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Messages */}
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <React.Fragment key={message.id || index}>
                {shouldShowDate(message, messages[index - 1]) && index > 0 && (
                  <DateSeparator 
                    date={getDateLabel(message.timestamp)} 
                    darkMode={darkMode}
                  />
                )}
                <ChatMessage
                  message={message}
                  onRegenerate={handleRegenerate}
                  onEdit={handleEdit}
                />
              </React.Fragment>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <TypingIndicator darkMode={darkMode} />
            )}
          </AnimatePresence>

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Scroll button */}
      <AnimatePresence>
        {showScrollButton && (
          <ScrollButton 
            onClick={scrollToBottom} 
            newCount={newMessageCount}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;