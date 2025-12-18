import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa";
import { useChatContext } from "../../context/ChatContext";

export const ChatInput = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("chat"); // chat or image

  const { sendMessage, isLoading, selectedModel, refreshConversations } = useChatContext();
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let messageText = input.trim();

    // Add /image prefix if in image mode
    if (mode === "image" && !messageText.toLowerCase().startsWith("/image")) {
      messageText = "/image " + messageText;
    }

    setInput("");

    await sendMessage(messageText, selectedModel);
    refreshConversations();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-700 p-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Mode Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setMode("chat")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "chat"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            💬 Chat
          </button>

          <button
            type="button"
            onClick={() => setMode("image")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              mode === "image"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FaImage className="w-3 h-3" />
            Generate Image
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
                placeholder={
                  mode === "image"
                    ? "Describe the image you want to generate..."
                    : "Type a message..."
                }
                className={`w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 transition-all min-h-[48px] max-h-[200px] ${
                  mode === "image"
                    ? "border-2 border-purple-500 focus:ring-purple-500"
                    : "border border-gray-700 focus:ring-blue-500"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                mode === "image"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <FaSpinner className="w-5 h-5 text-white animate-spin" />
              ) : mode === "image" ? (
                <FaImage className="w-5 h-5 text-white" />
              ) : (
                <FaPaperPlane className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            {mode === "image"
              ? "🎨 Describe what you want to generate"
              : "Press Enter to send, Shift+Enter for new line"}
          </p>
        </form>
      </div>
    </div>
  );
};