import React, { memo } from "react";
import { motion } from "framer-motion";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { WelcomeScreen } from "./WelcomeScreen";
import { useChatContext } from "../../context/ChatContext";

export const ChatContainer = memo(() => {
  const { messages, sendMessage, selectedModel, refreshConversations, darkMode } = useChatContext();

  const handleSelectPrompt = async (prompt) => {
    await sendMessage(prompt, selectedModel);
    refreshConversations();
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Theme-aware gradient background */}
      <div 
        className="absolute inset-0 transition-colors duration-300"
        style={{
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        {/* Gradient orbs - less intense in light mode */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
          ) : (
            <MessageList />
          )}
        </div>

        {/* Chat input - fixed at bottom */}
        <div className="relative flex-shrink-0">
          {/* Fade gradient */}
          <div 
            className="absolute -top-20 left-0 right-0 h-20 pointer-events-none"
            style={{
              background: `linear-gradient(to top, var(--bg-primary), transparent)`,
            }}
          />
          <div 
            className="relative backdrop-blur-xl border-t transition-colors duration-300"
            style={{
              backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: 'var(--border-primary)',
            }}
          >
            {/* Accent line */}
            <div 
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: 'linear-gradient(to right, transparent, var(--accent-primary), transparent)',
                opacity: 0.5,
              }}
            />
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;