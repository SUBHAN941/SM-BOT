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
    <div className="flex flex-col h-full bg-gray-900">
      {messages.length === 0 ? (
        <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
      ) : (
        <MessageList />
      )}
      <ChatInput />
    </div>
  );
};