import React, { useState, useRef, useEffect, memo } from "react";
import { FaTrash, FaComment, FaEllipsisV } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { formatRelativeTime, truncateText } from "../../utils/helper";
import { motion, AnimatePresence } from "framer-motion";

export const ConversationItem = memo(({ conversation, isActive, onClick, onDelete, darkMode }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
        isActive 
          ? "bg-purple-500/10 border-purple-500/30" 
          : "border-transparent"
      }`}
      style={{
        backgroundColor: isActive ? undefined : 'transparent',
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
      )}

      {/* Icon */}
      <div 
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isActive ? "bg-purple-500/20" : ""
        }`}
        style={{
          backgroundColor: isActive ? undefined : 'var(--bg-tertiary)',
        }}
      >
        {isActive ? (
          <HiSparkles className="w-4 h-4 text-purple-500" />
        ) : (
          <FaComment 
            className="w-4 h-4" 
            style={{ color: 'var(--text-muted)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p 
          className={`text-sm truncate font-medium ${isActive ? "text-purple-500" : ""}`}
          style={{ color: isActive ? undefined : 'var(--text-primary)' }}
        >
          {truncateText(conversation.title || "New Conversation", 22)}
        </p>
        <p 
          className="text-xs mt-0.5"
          style={{ color: 'var(--text-muted)' }}
        >
          {formatRelativeTime(conversation.createdAt || conversation.updatedAt || new Date())}
        </p>
      </div>

      {/* Menu Button */}
      <div 
        ref={menuRef}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className={`p-1.5 rounded-lg transition-colors ${showMenu ? "" : ""}`}
          style={{
            backgroundColor: showMenu ? 'var(--bg-tertiary)' : undefined,
            color: 'var(--text-tertiary)',
          }}
        >
          <FaEllipsisV className="w-3 h-3" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-2 top-full mt-1 rounded-lg shadow-xl py-1 z-50 min-w-[120px] border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 w-full text-sm transition-colors"
              >
                <FaTrash className="w-3 h-3" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

ConversationItem.displayName = "ConversationItem";

export default ConversationItem;