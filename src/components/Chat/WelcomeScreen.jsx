import React, { useState } from "react";
import { 
  FaRobot, 
  FaCode, 
  FaLightbulb, 
  FaBook, 
  FaImage,
  FaPen,
  FaChartLine,
  FaArrowRight
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";

const suggestions = [
  {
    icon: FaCode,
    title: "Write Code",
    description: "Generate clean, efficient code",
    prompt: "Write a Python function to sort a list using quicksort algorithm",
    gradient: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/20",
  },
  {
    icon: FaLightbulb,
    title: "Brainstorm Ideas",
    description: "Get creative suggestions",
    prompt: "Give me 5 creative startup ideas for 2024",
    gradient: "from-yellow-500 to-orange-500",
    bgGlow: "bg-yellow-500/20",
  },
  {
    icon: FaBook,
    title: "Explain Concepts",
    description: "Learn anything easily",
    prompt: "Explain quantum computing in simple terms",
    gradient: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
  },
  {
    icon: FaImage,
    title: "Generate Images",
    description: "Create stunning visuals",
    prompt: "/image A futuristic city with flying cars at sunset, cyberpunk style",
    gradient: "from-green-500 to-emerald-500",
    bgGlow: "bg-green-500/20",
  },
  {
    icon: FaPen,
    title: "Write Content",
    description: "Craft compelling text",
    prompt: "Write a professional email requesting a meeting with a potential client",
    gradient: "from-pink-500 to-rose-500",
    bgGlow: "bg-pink-500/20",
  },
  {
    icon: FaChartLine,
    title: "Analyze Data",
    description: "Get insights & analysis",
    prompt: "What are the key metrics I should track for a SaaS business?",
    gradient: "from-indigo-500 to-purple-500",
    bgGlow: "bg-indigo-500/20",
  },
];

const models = [
  { name: "GPT-4", color: "from-green-400 to-emerald-500" },
  { name: "Claude", color: "from-orange-400 to-amber-500" },
  { name: "Llama", color: "from-blue-400 to-indigo-500" },
  { name: "Mixtral", color: "from-purple-400 to-pink-500" },
  { name: "Gemini", color: "from-cyan-400 to-blue-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export const WelcomeScreen = ({ onSelectPrompt }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    // FIXED: Changed from flex items-center justify-center to block with padding
    // This allows the content to scroll properly
    <div className="min-h-full w-full px-4 py-8 md:px-6 md:py-12">
      
      {/* Center container with max-width */}
      <div className="max-w-4xl mx-auto">
        
        {/* Background decorations - now properly positioned */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center"
        >
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8"
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-50"
            />
            
            {/* Spinning border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75"
            />
            
            {/* Main logo container */}
            <div className="relative w-full h-full bg-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
              <div className="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <FaRobot className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to AI Chat
              </span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 mx-auto max-w-xs bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-gray-400 mb-8 md:mb-10 text-base md:text-xl max-w-lg mx-auto"
          >
            Your intelligent assistant powered by{" "}
            <span className="text-purple-400 font-medium">multiple AI models</span>
          </motion.p>

          {/* Suggestion Cards Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onSelectPrompt(suggestion.prompt)}
                className="group relative p-4 md:p-5 rounded-2xl text-left transition-all duration-300 overflow-hidden"
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl transition-all duration-300 group-hover:border-gray-600/50" />
                
                {/* Hover glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                  className={`absolute inset-0 ${suggestion.bgGlow} blur-xl transition-opacity duration-300`}
                />
                
                {/* Gradient border on hover */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${suggestion.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  style={{ padding: "1px" }}
                >
                  <div className="absolute inset-[1px] bg-gray-800/95 rounded-2xl" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 rounded-xl bg-gradient-to-br ${suggestion.gradient} p-0.5 shadow-lg`}>
                    <div className="w-full h-full bg-gray-800 rounded-[10px] flex items-center justify-center group-hover:bg-gray-700/50 transition-colors">
                      <suggestion.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="font-semibold text-white text-sm md:text-base mb-1 flex items-center gap-2">
                    {suggestion.title}
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: hoveredCard === index ? 1 : 0, 
                        x: hoveredCard === index ? 0 : -10 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaArrowRight className="w-3 h-3 text-gray-400" />
                    </motion.span>
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3">
                    {suggestion.description}
                  </p>
                  
                  {/* Prompt preview */}
                  <p className="text-xs text-gray-500 line-clamp-2 italic">
                    "{suggestion.prompt}"
                  </p>
                </div>

                {/* Shimmer effect on hover */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: hoveredCard === index ? "100%" : "-100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Models Section */}
          <motion.div variants={itemVariants} className="relative">
            {/* Section header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-700" />
              <span className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wider">
                Powered by
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-700" />
            </div>

            {/* Model pills */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {models.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group relative cursor-default"
                >
                  {/* Glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${model.color} rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                  
                  {/* Pill */}
                  <div className="relative px-3 py-1.5 md:px-4 md:py-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700/50 group-hover:border-gray-600 transition-all duration-300">
                    <span className={`text-xs md:text-sm font-medium bg-gradient-to-r ${model.color} bg-clip-text text-transparent`}>
                      {model.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 md:mt-10 text-center pb-4"
          >
            <p className="text-xs text-gray-600 flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700/50">
                <HiSparkles className="w-3 h-3 text-purple-400" />
                <span className="text-gray-400">Pro tip</span>
              </span>
              <span>Click any card above or start typing to begin</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};