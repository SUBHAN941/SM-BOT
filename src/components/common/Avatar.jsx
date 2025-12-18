import React from "react";
import { FaRobot, FaUser } from "react-icons/fa";

export const Avatar = ({ type, className = "" }) => {
  if (type === "user") {
    return (
      <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 ${className}`}>
        <FaUser className="w-4 h-4 text-white" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex-shrink-0 ${className}`}>
      <FaRobot className="w-4 h-4 text-white" />
    </div>
  );
};