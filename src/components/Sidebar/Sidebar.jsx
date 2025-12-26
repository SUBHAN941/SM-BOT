import React, { useState, memo, useCallback } from "react";
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

export const Sidebar = memo(() => {
  const { 
    sidebarOpen, 
    setSidebarOpen,
    conversations, 
    conversationId,
    newChat,
    loadConversation,
    deleteConversation,
    setSettingsOpen,
    darkMode
  } = useChatContext();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = (conversations || []).filter((conv) =>
    (conv.title || "New Conversation").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = useCallback(() => {
    newChat();
  }, [newChat]);

  const handleSelectConversation = useCallback((id) => {
    loadConversation?.(id);
  }, [loadConversation]);

  const handleDeleteConversation = useCallback((id) => {
    deleteConversation(id);
  }, [deleteConversation]);

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);

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
          <div 
            className="h-full w-[280px] flex flex-col border-r transition-colors duration-300"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            {/* Header */}
            <div 
              className="p-4 border-b"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <HiSparkles className="w-4 h-4 text-white" />
                  </div>
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Chats
                  </span>
                </div>
                
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg transition-colors lg:hidden"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-tertiary)',
                  }}
                  aria-label="Close sidebar"
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

              {/* Search */}
              <div className="relative mt-4">
                <FaSearch 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    aria-label="Clear search"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredConversations.length === 0 ? (
                <div 
                  className="flex flex-col items-center justify-center h-40"
                  style={{ color: 'var(--text-muted)' }}
                >
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
                    darkMode={darkMode}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div 
              className="p-3 border-t space-y-1"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <button 
                onClick={handleOpenSettings}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <FaCog className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;