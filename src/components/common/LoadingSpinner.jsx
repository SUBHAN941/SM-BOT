import React from "react";
import { motion } from "framer-motion";

export const LoadingSpinner = ({ size = "md", color = "blue", className = "" }) => {
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colors = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    pink: "border-pink-500",
    white: "border-white",
    gray: "border-gray-400",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* Outer ring */}
      <div className={`absolute inset-0 rounded-full border-2 ${colors[color]} opacity-20`} />
      
      {/* Spinning ring */}
      <div 
        className={`absolute inset-0 rounded-full border-2 border-transparent ${colors[color]} border-t-current animate-spin`}
      />
    </div>
  );
};

// Dots loading animation
export const LoadingDots = ({ size = "md", color = "purple", className = "" }) => {
  const sizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const colors = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    white: "bg-white",
    gray: "bg-gray-400",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
          className={`${sizes[size]} ${colors[color]} rounded-full`}
        />
      ))}
    </div>
  );
};

// Typing indicator for chat
export const TypingIndicator = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1 px-4 py-3 bg-gray-800/60 rounded-2xl border border-gray-700/50">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 bg-purple-400 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          className="w-2 h-2 bg-purple-400 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          className="w-2 h-2 bg-purple-400 rounded-full"
        />
      </div>
      <span className="text-sm text-gray-500">AI is thinking...</span>
    </div>
  );
};

// Pulse loading for images/content
export const PulseLoader = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-0 bg-purple-500/20 rounded-xl blur-xl"
      />
      <div className="relative flex items-center justify-center p-8 bg-gray-800/50 rounded-xl border border-gray-700/50">
        <LoadingSpinner size="lg" color="purple" />
      </div>
    </div>
  );
};

// Skeleton loader
export const Skeleton = ({ 
  width = "full", 
  height = "4", 
  rounded = "md",
  className = "" 
}) => {
  const widths = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/4": "w-1/4",
    "1/3": "w-1/3",
    "2/3": "w-2/3",
  };

  const heights = {
    "2": "h-2",
    "3": "h-3",
    "4": "h-4",
    "6": "h-6",
    "8": "h-8",
    "10": "h-10",
    "12": "h-12",
    "16": "h-16",
    "20": "h-20",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div 
      className={`
        ${widths[width] || width}
        ${heights[height] || height}
        ${roundedStyles[rounded]}
        bg-gray-800 
        overflow-hidden
        ${className}
      `}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"
      />
    </div>
  );
};

// Message skeleton for chat
export const MessageSkeleton = ({ isUser = false }) => {
  return (
    <div className={`flex gap-3 p-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <Skeleton width="w-8" height="h-8" rounded="full" />
      <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} flex-1 max-w-md`}>
        <Skeleton width="1/4" height="h-3" />
        <Skeleton width="full" height="h-4" />
        <Skeleton width="3/4" height="h-4" />
        <Skeleton width="1/2" height="h-4" />
      </div>
    </div>
  );
};