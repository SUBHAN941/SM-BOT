import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  useMemo 
} from "react";
import { useChat } from "../hooks/useChat";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTheme } from "../hooks/useTheme";
import { apiService } from "../services/api";

const ChatContext = createContext(null);

// Default models fallback
const DEFAULT_MODELS = [
  { key: "gpt-3.5", name: "GPT-3.5 Turbo", description: "Fast & efficient" },
  { key: "gpt-4", name: "GPT-4 Turbo", description: "Most capable" },
  { key: "claude-3", name: "Claude 3 Haiku", description: "Fast & safe" },
  { key: "llama-3.1-8b", name: "Llama 3.1 8B", description: "Open source" },
];

// Default settings
const DEFAULT_SETTINGS = {
  temperature: 0.7,
  maxTokens: 2048,
  streamingEnabled: true,
  sendWithEnter: true,
  showTimestamps: true,
  compactMode: false,
  soundEnabled: false,
  autoScroll: true,
  fontSize: "medium", // small, medium, large
  language: "en",
};

export const ChatProvider = ({ children }) => {
  // Hooks
  const chat = useChat();
  const theme = useTheme();
  const [selectedModel, setSelectedModel] = useLocalStorage("selectedModel", "gpt-3.5");
  const [settings, setSettings] = useLocalStorage("chatSettings", DEFAULT_SETTINGS);
  
  // State
  const [models, setModels] = useState(DEFAULT_MODELS);
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebarOpen", true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  // Load models on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadModels = async () => {
      try {
        const response = await apiService.getModels();
        if (isMounted && response.success) {
          setModels(response.data);
        }
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        if (isMounted) setIsLoadingModels(false);
      }
    };
    
    loadModels();
    return () => { isMounted = false; };
  }, []);

  // Load conversations on mount
  useEffect(() => {
    refreshConversations();
  }, []);

  // Apply font size setting
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    root.style.setProperty("--chat-font-size", fontSizes[settings.fontSize] || "16px");
  }, [settings.fontSize]);

  // Memoized callbacks
  const refreshConversations = useCallback(async () => {
    try {
      const response = await apiService.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, []);

  const newChat = useCallback(() => {
    chat.clearMessages();
  }, [chat]);

  const deleteConversation = useCallback(async (id) => {
    try {
      await apiService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (chat.conversationId === id) {
        chat.clearMessages();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  }, [chat]);

  const handleReaction = useCallback(async (messageId, reaction) => {
    if (!chat.conversationId) return;
    
    try {
      await apiService.addReaction(chat.conversationId, messageId, reaction);
      chat.setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, userReaction: reaction } : msg
        )
      );
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  }, [chat]);

  // Update a single setting
  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, [setSettings]);

  // Reset settings to default
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  // Memoized context value
  const value = useMemo(() => ({
    // Chat state
    ...chat,
    
    // Model selection
    selectedModel,
    setSelectedModel,
    models,
    isLoadingModels,
    
    // Conversations
    conversations,
    refreshConversations,
    newChat,
    deleteConversation,
    
    // Sidebar
    sidebarOpen,
    setSidebarOpen,
    
    // Settings
    settings,
    setSettings,
    updateSetting,
    resetSettings,
    settingsOpen,
    setSettingsOpen,
    
    // Theme
    ...theme,
    
    // Reactions
    handleReaction,
  }), [
    chat,
    selectedModel,
    setSelectedModel,
    models,
    isLoadingModels,
    conversations,
    refreshConversations,
    newChat,
    deleteConversation,
    sidebarOpen,
    setSidebarOpen,
    settings,
    setSettings,
    updateSetting,
    resetSettings,
    settingsOpen,
    setSettingsOpen,
    theme,
    handleReaction,
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

export default ChatContext;