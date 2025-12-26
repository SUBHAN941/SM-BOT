import { useState, useCallback, useRef } from "react";
import { apiService } from "../services/api";
import { generateId } from "../utils/helper";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  
  // Ref to abort streaming
  const abortControllerRef = useRef(null);

  // Send message with streaming support
  const sendMessage = useCallback(async (content, model = "llama-3.1-8b", useStreaming = true) => {
    if (!content.trim()) return;

    setError(null);
    setIsLoading(true);

    const userMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create placeholder for assistant message
    const assistantMessageId = generateId();
    const assistantMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      model,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      if (useStreaming) {
        // Streaming mode
        setIsStreaming(true);
        abortControllerRef.current = new AbortController();

        const result = await apiService.streamMessage(
          content,
          conversationId,
          model,
          0.7,
          (streamedContent) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: streamedContent }
                  : msg
              )
            );
          }
        );

        // Finalize message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  content: result.content,
                  isStreaming: false,
                  id: result.messageId || assistantMessageId,
                }
              : msg
          )
        );

        if (result.conversationId) {
          setConversationId(result.conversationId);
        }
      } else {
        // Non-streaming mode
        const response = await apiService.sendMessage(content, conversationId, model);

        if (response.success) {
          setConversationId(response.data.conversationId);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    id: response.data.message.id,
                    role: "assistant",
                    content: response.data.message.content,
                    timestamp: new Date(response.data.message.timestamp),
                    model: response.data.message.model,
                    image: response.data.message.image || null,
                    isStreaming: false,
                  }
                : msg
            )
          );
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled streaming
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false, isCancelled: true }
              : msg
          )
        );
      } else {
        setError(err.message);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error. Please try again.",
                  isError: true,
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [conversationId]);

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  // Load conversation
  const loadConversation = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getConversation(id);

      if (response.success) {
        setConversationId(id);
        setMessages(
          response.data.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            image: msg.image || null,
            isStreaming: false,
          }))
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Regenerate message
  const regenerateMessage = useCallback(async (messageId, model) => {
    if (!conversationId) return;
    
    try {
      setIsLoading(true);
      
      const response = await apiService.regenerateMessage(
        conversationId,
        messageId,
        model
      );

      if (response.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: response.data.message.content,
                  regenerated: true,
                  timestamp: new Date(),
                }
              : msg
          )
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Edit message
  const editMessage = useCallback(async (messageId, newContent, model) => {
    if (!conversationId) return;
    
    try {
      setIsLoading(true);
      
      const response = await apiService.editMessage(
        conversationId,
        messageId,
        newContent,
        model
      );

      if (response.success) {
        // Update the edited message and add new response
        setMessages((prev) => {
          const messageIndex = prev.findIndex((m) => m.id === messageId);
          if (messageIndex === -1) return prev;

          const updatedMessages = prev.slice(0, messageIndex + 1);
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            content: newContent,
            edited: true,
          };

          if (response.data.newResponse) {
            updatedMessages.push({
              id: response.data.newResponse.id,
              role: "assistant",
              content: response.data.newResponse.content,
              timestamp: new Date(),
              model,
            });
          }

          return updatedMessages;
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  return {
    messages,
    setMessages,
    isLoading,
    isStreaming,
    error,
    conversationId,
    sendMessage,
    stopStreaming,
    clearMessages,
    loadConversation,
    regenerateMessage,
    editMessage,
  };
};