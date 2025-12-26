import React, { memo } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useChatContext } from "../../context/ChatContext";

const sizeMap = {
  sm: { container: "w-6 h-6", icon: "w-3 h-3" },
  md: { container: "w-8 h-8", icon: "w-4 h-4" },
  lg: { container: "w-10 h-10", icon: "w-5 h-5" },
  xl: { container: "w-12 h-12", icon: "w-6 h-6" },
};

export const Avatar = memo(({ type, size = "md", className = "" }) => {
  const { darkMode } = useChatContext();
  const { container, icon } = sizeMap[size];
  const isUser = type === "user";

  return (
    <div
      className={`
        relative flex items-center justify-center flex-shrink-0
        ${container}
        rounded-full
        ${isUser
          ? "bg-gradient-to-br from-blue-500 to-blue-600"
          : "bg-gradient-to-br from-purple-500 to-pink-500"
        }
        shadow-lg
        ${className}
      `}
      style={{
        boxShadow: isUser 
          ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
          : '0 4px 12px rgba(139, 92, 246, 0.3)',
      }}
      role="img"
      aria-label={isUser ? "User avatar" : "AI assistant avatar"}
    >
      {isUser ? (
        <FaUser className={`${icon} text-white`} />
      ) : (
        <>
          <FaRobot className={`${icon} text-white`} />
          {size !== "sm" && (
            <HiSparkles className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-yellow-300" />
          )}
        </>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;