import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useChatContext } from "../../context/ChatContext";

export const ChatInput = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("chat");
  const [isFocused, setIsFocused] = useState(false);

  const { sendMessage, isLoading, selectedModel, refreshConversations } = useChatContext();
  const textareaRef = useRef(null);

  // Auto-resize textarea (with max limit)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let messageText = input.trim();

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
    <div className="p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Compact Mode Toggle + Input in one row on mobile */}
        <div className="flex flex-col gap-3">
          
          {/* Mode Toggle - Compact */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center p-0.5 rounded-lg bg-gray-800/80 border border-gray-700/50">
              <button
                type="button"
                onClick={() => setMode("chat")}
                className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  mode === "chat" ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {mode === "chat" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md" />
                )}
                <span className="relative flex items-center gap-1.5">
                  <HiSparkles className="w-3 h-3" />
                  Chat
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode("image")}
                className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  mode === "image" ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {mode === "image" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md" />
                )}
                <span className="relative flex items-center gap-1.5">
                  <FaImage className="w-3 h-3" />
                  Image
                </span>
              </button>
            </div>

            {/* Helper text - only show on larger screens */}
            <p className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 text-[10px]">Enter</kbd>
              <span>send</span>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 text-[10px]">Shift+Enter</kbd>
              <span>new line</span>
            </p>
          </div>

          {/* Input Form - Compact */}
          <form onSubmit={handleSubmit}>
            <div
              className={`relative flex items-end gap-2 p-2 rounded-xl border transition-all duration-200 ${
                isFocused
                  ? mode === "image"
                    ? "bg-gray-800/90 border-purple-500/50 shadow-lg shadow-purple-500/10"
                    : "bg-gray-800/90 border-blue-500/50 shadow-lg shadow-blue-500/10"
                  : "bg-gray-800/60 border-gray-700/50"
              }`}
            >
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
                rows={1}
                placeholder={
                  mode === "image"
                    ? "Describe the image you want to generate..."
                    : "Type your message..."
                }
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 resize-none focus:outline-none min-h-[24px] max-h-[120px] py-1.5 px-2 leading-normal"
              />

              {/* Submit Button - Compact */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                  input.trim() && !isLoading
                    ? mode === "image"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25"
                    : "bg-gray-700"
                }`}
              >
                {isLoading ? (
                  <FaSpinner className="w-4 h-4 text-white animate-spin" />
                ) : mode === "image" ? (
                  <FaImage className="w-4 h-4 text-white" />
                ) : (
                  <FaPaperPlane className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};