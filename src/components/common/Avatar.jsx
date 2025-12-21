import React from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";

export const Avatar = ({ 
  type, 
  size = "md", 
  className = "", 
  showStatus = false,
  isOnline = true,
  animated = true 
}) => {
  
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const statusSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
    xl: "w-3 h-3",
  };

  if (type === "user") {
    return (
      <motion.div
        initial={animated ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`relative flex-shrink-0 ${className}`}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-blue-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Main avatar */}
        <div 
          className={`
            relative flex items-center justify-center 
            ${sizes[size]} 
            rounded-full 
            bg-gradient-to-br from-blue-500 to-blue-600
            shadow-lg shadow-blue-500/20
            ring-2 ring-blue-400/20
            transition-all duration-300
            hover:shadow-blue-500/40
            hover:ring-blue-400/40
          `}
        >
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Icon */}
          <FaUser className={`relative ${iconSizes[size]} text-white drop-shadow-sm`} />
        </div>

        {/* Online status indicator */}
        {showStatus && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              absolute -bottom-0.5 -right-0.5 
              ${statusSizes[size]} 
              rounded-full 
              ${isOnline ? "bg-green-500" : "bg-gray-500"}
              ring-2 ring-gray-900
            `}
          >
            {isOnline && (
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  // AI Assistant Avatar
  return (
    <motion.div
      initial={animated ? { scale: 0, rotate: -180 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative flex-shrink-0 group ${className}`}
    >
      {/* Animated glow ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className={`absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300`}
      />
      
      {/* Pulse glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-md animate-pulse" />
      
      {/* Main avatar */}
      <div 
        className={`
          relative flex items-center justify-center 
          ${sizes[size]} 
          rounded-full 
          bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600
          shadow-lg shadow-purple-500/30
          ring-2 ring-purple-400/30
          transition-all duration-300
          group-hover:shadow-purple-500/50
          group-hover:ring-purple-400/50
        `}
      >
        {/* Inner gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-white/10" />
        
        {/* Sparkle decoration */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-0.5 -right-0.5"
        >
          <HiSparkles className="w-2 h-2 text-yellow-300 drop-shadow-lg" />
        </motion.div>
        
        {/* Robot Icon */}
        <motion.div
          animate={{ 
            y: [0, -1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaRobot className={`relative ${iconSizes[size]} text-white drop-shadow-sm`} />
        </motion.div>
      </div>

      {/* AI Badge */}
      {size !== "sm" && (
        <div className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded text-[8px] font-bold text-white shadow-lg">
          AI
        </div>
      )}
    </motion.div>
  );
};

// Compact version without animations for message lists
export const AvatarSimple = ({ type, size = "md", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (type === "user") {
    return (
      <div 
        className={`
          flex items-center justify-center 
          ${sizes[size]} 
          rounded-full 
          bg-gradient-to-br from-blue-500 to-blue-600
          shadow-md shadow-blue-500/20
          flex-shrink-0
          ${className}
        `}
      >
        <FaUser className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  return (
    <div 
      className={`
        flex items-center justify-center 
        ${sizes[size]} 
        rounded-full 
        bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600
        shadow-md shadow-purple-500/20
        flex-shrink-0
        ${className}
      `}
    >
      <FaRobot className={`${iconSizes[size]} text-white`} />
    </div>
  );
};