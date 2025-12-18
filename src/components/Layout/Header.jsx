import React from "react";
import { FaBars, FaRobot } from "react-icons/fa";
import { useChatContext } from "../../context/ChatContext";
import { ModelSelector } from "../common/ModelSelector";

export const Header = () => {
  const { sidebarOpen, setSidebarOpen } = useChatContext();

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <FaBars className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FaRobot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white hidden sm:block">
            AI Chat
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <ModelSelector />
      </div>
    </header>
  );
};