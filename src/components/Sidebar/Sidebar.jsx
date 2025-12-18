import React from "react";
import { FaPlus, FaCog, FaGithub } from "react-icons/fa";
import { ConversationItem } from "./ConversationItem";
import { useChatContext } from "../../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

export const Sidebar = () => {
  const {
    conversations,
    conversationId,
    loadConversation,
    newChat,
    deleteConversation,
    sidebarOpen,
  } = useChatContext();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-full"
        >
          {/* Header - New Chat Button */}
          <div className="p-3 border-b border-gray-800">
            <button
              onClick={newChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-200 text-white"
            >
              <FaPlus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Recent Chats
            </h3>

            <div className="space-y-1 mt-1">
              {conversations.length === 0 ? (
                <p className="px-3 py-8 text-sm text-gray-500 text-center">
                  No conversations yet.
                  <br />
                  Start a new chat!
                </p>
              ) : (
                conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === conversationId}
                    onClick={() => loadConversation(conv.id)}
                    onDelete={deleteConversation}
                  />
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-800 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm">
              <FaCog className="w-4 h-4" />
              Settings
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};