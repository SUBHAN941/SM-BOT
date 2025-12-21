import React from "react";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { WelcomeScreen } from "./WelcomeScreen";
import { useChatContext } from "../../context/ChatContext";

export const ChatContainer = () => {
  const { messages, sendMessage, selectedModel, refreshConversations } = useChatContext();

  const handleSelectPrompt = async (prompt) => {
    await sendMessage(prompt, selectedModel);
    refreshConversations();
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main content container - THIS IS THE KEY FIX */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Scrollable content area - flex-1 makes it take remaining space, overflow-y-auto makes it scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
          ) : (
            <MessageList />
          )}
        </div>

        {/* Chat input - fixed at bottom, doesn't scroll */}
        <div className="relative flex-shrink-0">
          <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none" />
          <div className="relative backdrop-blur-xl bg-gray-900/50 border-t border-white/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
};