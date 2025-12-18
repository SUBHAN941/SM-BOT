import { useState, useCallback } from "react";
import { apiService } from "../services/api";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const sendMessage = useCallback(async (content, model = "llama-3.1-8b") => {
    if (!content.trim()) return;

    setError(null);
    setIsLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await apiService.sendMessage(content, conversationId, model);

      if (response.success) {
        setConversationId(response.data.conversationId);

        const assistantMessage = {
          id: response.data.message.id,
          role: "assistant",
          content: response.data.message.content,
          timestamp: new Date(response.data.message.timestamp),
          model: response.data.message.model,
          image: response.data.message.image || null,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  const loadConversation = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const response = await apiService.getConversation(id);

      if (response.success) {
        setConversationId(id);
        setMessages(
          response.data.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            image: msg.image || null,
          }))
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    sendMessage,
    clearMessages,
    loadConversation,
    setMessages,
  };
};