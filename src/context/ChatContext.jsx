import React, { createContext, useContext, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { apiService } from "../services/api";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const chat = useChat();
  const [selectedModel, setSelectedModel] = useLocalStorage("selectedModel", "gpt-3.5");
  const [models, setModels] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await apiService.getModels();
        if (response.success) {
          setModels(response.data);
        }
      } catch (error) {
        console.error("Failed to load models:", error);
        // Set default models if API fails
        setModels([
          { key: "gpt-3.5", name: "GPT-3.5 Turbo" },
          { key: "gpt-4", name: "GPT-4 Turbo" },
          { key: "claude-3", name: "Claude 3 Haiku" },
        ]);
      }
    };
    loadModels();
  }, []);

  // Load conversations on mount
  useEffect(() => {
    refreshConversations();
  }, []);

  const refreshConversations = async () => {
    try {
      const response = await apiService.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const newChat = () => {
    chat.clearMessages();
  };

  const deleteConversation = async (id) => {
    try {
      await apiService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (chat.conversationId === id) {
        chat.clearMessages();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const value = {
    ...chat,
    selectedModel,
    setSelectedModel,
    models,
    conversations,
    refreshConversations,
    newChat,
    deleteConversation,
    sidebarOpen,
    setSidebarOpen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};