import React, { useState } from "react";
import { FaTrash, FaComment, FaEllipsisV } from "react-icons/fa";
import { formatRelativeTime, truncateText } from "../../utils/helper";
import { motion, AnimatePresence } from "framer-motion";

export const ConversationItem = ({ conversation, isActive, onClick, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-gray-700 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
      onClick={onClick}
    >
      <FaComment className="w-4 h-4 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm truncate font-medium">
          {truncateText(conversation.title, 25)}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatRelativeTime(conversation.createdAt)}
        </p>
      </div>

      {/* Menu Button */}
      <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 hover:bg-gray-600 rounded transition-colors"
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
              className="absolute right-0 top-full mt-1 bg-gray-700 rounded-lg shadow-lg py-1 z-20 min-w-[120px]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conversation.id);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-gray-600 w-full text-sm transition-colors"
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
};