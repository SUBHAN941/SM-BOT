import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaSearch,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaHistory
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useChatContext } from "../../context/ChatContext";
import { ConversationItem } from "./ConversationItem";

export const Sidebar = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen,
    conversations, 
    conversationId,  // Current conversation ID from useChat
    newChat,         // Function to start new chat
    loadConversation, // Function to load a conversation
    deleteConversation
  } = useChatContext();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search
  const filteredConversations = (conversations || []).filter((conv) =>
    (conv.title || "New Conversation").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle new chat
  const handleNewChat = () => {
    console.log("Creating new chat...");
    newChat();
  };

  // Handle select conversation
  const handleSelectConversation = (id) => {
    console.log("Selecting conversation:", id);
    if (loadConversation) {
      loadConversation(id);
    }
  };

  // Handle delete conversation
  const handleDeleteConversation = (id) => {
    console.log("Deleting conversation:", id);
    deleteConversation(id);
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "280px", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex-shrink-0 h-full z-40 lg:relative fixed left-0 top-0"
        >
          <div className="h-full w-[280px] bg-gray-900 border-r border-gray-800 flex flex-col">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              {/* Title row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <HiSparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Chats</span>
                </div>
                
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors lg:hidden"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-200 active:scale-95"
              >
                <FaPlus className="w-4 h-4" />
                <span>New Chat</span>
              </button>

              {/* Search Bar */}
              <div className="relative mt-4">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-white"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <FaHistory className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? "No matching chats" : "No conversations yet"}
                  </p>
                  <p className="text-xs mt-1">
                    {searchQuery ? "Try different keywords" : "Start a new chat!"}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={conversationId === conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    onDelete={() => handleDeleteConversation(conversation.id)}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-800 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <FaCog className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                <FaSignOutAlt className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};