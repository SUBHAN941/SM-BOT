import React from "react";
import { FaRobot, FaCode, FaLightbulb, FaBook } from "react-icons/fa";
import { motion } from "framer-motion";

const suggestions = [
  {
    icon: FaCode,
    title: "Write code",
    prompt: "Write a Python function to sort a list using quicksort algorithm",
  },
  {
    icon: FaLightbulb,
    title: "Brainstorm ideas",
    prompt: "Give me 5 creative startup ideas for 2024",
  },
  {
    icon: FaBook,
    title: "Explain concept",
    prompt: "Explain quantum computing in simple terms",
  },
];

export const WelcomeScreen = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <FaRobot className="w-10 h-10 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Welcome to AI Chat
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-8 text-lg"
        >
          Your intelligent assistant powered by multiple AI models
        </motion.p>

        {/* Suggestion Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPrompt(suggestion.prompt)}
              className="p-4 bg-gray-800 hover:bg-gray-750 rounded-xl text-left transition-all duration-200 group border border-gray-700 hover:border-blue-500/50"
            >
              <suggestion.icon className="w-6 h-6 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1 text-white">{suggestion.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {suggestion.prompt}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* Models */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-2 items-center"
        >
          <span className="text-sm text-gray-500">Powered by:</span>
          {["GPT-4", "Claude", "Llama", "Mixtral", "Gemini"].map((model, i) => (
            <React.Fragment key={model}>
              <span className="text-sm text-gray-400 hover:text-blue-400 transition-colors cursor-default">
                {model}
              </span>
              {i < 4 && <span className="text-gray-600">•</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};