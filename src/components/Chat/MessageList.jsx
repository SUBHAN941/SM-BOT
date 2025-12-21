import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown, FaComments } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { ChatMessage } from "./ChatMessage";
import { useChatContext } from "../../context/ChatContext";

export const MessageList = () => {
  const { messages, isLoading } = useChatContext();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Check if user is near bottom of chat
  const checkScrollPosition = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const nearBottom = distanceFromBottom < 100;
      
      setIsNearBottom(nearBottom);
      setShowScrollButton(!nearBottom && messages.length > 3);
      
      if (nearBottom) {
        setNewMessageCount(0);
      }
    }
  }, [messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setNewMessageCount((prev) => prev + 1);
    }
  }, [messages, isNearBottom]);

  // Listen for scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, [checkScrollPosition]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageCount(0);
  };

  // Group messages by date
  const getMessageDate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = getMessageDate(currentMsg.timestamp);
    const prevDate = getMessageDate(prevMsg.timestamp);
    return currentDate !== prevDate;
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Top fade gradient */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-transparent z-10 pointer-events-none" />

      {/* Messages container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scroll-smooth custom-scrollbar"
      >
        {/* Top spacing */}
        <div className="h-4" />

        {/* Conversation start indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center py-6"
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-md animate-pulse" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <HiSparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Conversation started</span>
              {messages[0]?.timestamp && (
                <span className="text-gray-500 ml-2">
                  • {getMessageDate(messages[0].timestamp)}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <React.Fragment key={message.id || index}>
              {/* Date separator */}
              {shouldShowDateSeparator(message, messages[index - 1]) && index > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-700" />
                    <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/30">
                      {getMessageDate(message.timestamp)}
                    </span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-700" />
                  </div>
                </motion.div>
              )}

              {/* Message */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  layout: { duration: 0.2 },
                }}
              >
                <ChatMessage message={message} />
              </motion.div>
            </React.Fragment>
          ))}
        </AnimatePresence>

        {/* Typing indicator when loading */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 px-4 py-6"
            >
              <div className="max-w-4xl mx-auto flex items-center gap-4 w-full">
                {/* AI Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-1 bg-purple-500/30 rounded-full blur-md animate-pulse" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <HiSparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                </div>

                {/* Typing dots */}
                <div className="flex items-center gap-1 px-4 py-3 bg-gray-800/60 rounded-2xl border border-gray-700/50">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <span className="ml-2 text-sm text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom spacing */}
        <div className="h-4" />
        <div ref={bottomRef} />
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToBottom}
            className="absolute bottom-6 right-6 group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button */}
            <div className="relative flex items-center gap-2 px-4 py-2.5 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm rounded-full border border-gray-600/50 shadow-xl transition-all duration-300">
              <FaArrowDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-colors" />
              
              {/* New message count badge */}
              {newMessageCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 text-xs font-medium text-purple-300"
                >
                  {newMessageCount} new
                </motion.span>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message count indicator */}
      <div className="absolute top-4 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700/50 text-xs text-gray-400"
        >
          <FaComments className="w-3 h-3 text-purple-400" />
          <span>{messages.length} messages</span>
        </motion.div>
      </div>
    </div>
  );
};