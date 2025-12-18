import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { useChatContext } from "../../context/ChatContext";

export const ModelSelector = () => {
  const { models, selectedModel, setSelectedModel } = useChatContext();

  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white text-sm cursor-pointer hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {models.map((model) => (
          <option key={model.key} value={model.key}>
            {model.name}
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3" />
    </div>
  );
};