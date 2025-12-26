import React, { useState, memo } from "react";
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
import { useChatContext } from "../../context/ChatContext";

const suggestions = [
  {
    icon: FaCode,
    title: "Write Code",
    description: "Generate clean, efficient code",
    prompt: "Write a Python function to sort a list using quicksort algorithm",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FaLightbulb,
    title: "Brainstorm Ideas",
    description: "Get creative suggestions",
    prompt: "Give me 5 creative startup ideas for 2024",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: FaBook,
    title: "Explain Concepts",
    description: "Learn anything easily",
    prompt: "Explain quantum computing in simple terms",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FaImage,
    title: "Generate Images",
    description: "Create stunning visuals",
    prompt: "/image A futuristic city with flying cars at sunset, cyberpunk style",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: FaPen,
    title: "Write Content",
    description: "Craft compelling text",
    prompt: "Write a professional email requesting a meeting with a potential client",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: FaChartLine,
    title: "Analyze Data",
    description: "Get insights & analysis",
    prompt: "What are the key metrics I should track for a SaaS business?",
    gradient: "from-indigo-500 to-purple-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const WelcomeScreen = memo(({ onSelectPrompt }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { darkMode, models } = useChatContext();

  return (
    <div className="min-h-full w-full px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-4xl mx-auto">
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-50"
            />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75"
            />
            
            <div 
              className="relative w-full h-full rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div 
                className="absolute inset-1 rounded-2xl"
                style={{ 
                  background: darkMode 
                    ? 'linear-gradient(to bottom right, #1f2937, #111827)' 
                    : 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)'
                }}
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <FaRobot className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
            className="mb-8 md:mb-10 text-base md:text-xl max-w-lg mx-auto"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Your intelligent assistant powered by{" "}
            <span className="text-purple-500 font-medium">multiple AI models</span>
          </motion.p>

          {/* Suggestion Cards */}
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
                className="group relative p-4 md:p-5 rounded-2xl text-left transition-all duration-300 overflow-hidden border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: hoveredCard === index 
                    ? 'var(--accent-primary)' 
                    : 'var(--border-primary)',
                }}
              >
                {/* Hover glow */}
                {hoveredCard === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 blur-xl"
                    style={{
                      background: `linear-gradient(135deg, ${
                        suggestion.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.1)' :
                        suggestion.gradient.includes('purple') ? 'rgba(139, 92, 246, 0.1)' :
                        suggestion.gradient.includes('pink') ? 'rgba(236, 72, 153, 0.1)' :
                        suggestion.gradient.includes('yellow') ? 'rgba(234, 179, 8, 0.1)' :
                        suggestion.gradient.includes('green') ? 'rgba(34, 197, 94, 0.1)' :
                        'rgba(99, 102, 241, 0.1)'
                      }, transparent)`,
                    }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 rounded-xl bg-gradient-to-br ${suggestion.gradient} p-0.5 shadow-lg`}>
                    <div 
                      className="w-full h-full rounded-[10px] flex items-center justify-center transition-colors"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                      <suggestion.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--text-primary)' }} />
                    </div>
                  </div>

                  <h3 
                    className="font-semibold text-sm md:text-base mb-1 flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {suggestion.title}
                    {hoveredCard === index && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <FaArrowRight className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                      </motion.span>
                    )}
                  </h3>
                  <p 
                    className="text-xs md:text-sm mb-2 md:mb-3"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {suggestion.description}
                  </p>
                  
                  <p 
                    className="text-xs line-clamp-2 italic"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    "{suggestion.prompt}"
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Models Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div 
                className="h-px w-12" 
                style={{ background: 'linear-gradient(to right, transparent, var(--border-primary))' }}
              />
              <span 
                className="text-xs md:text-sm font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Powered by
              </span>
              <div 
                className="h-px w-12" 
                style={{ background: 'linear-gradient(to left, transparent, var(--border-primary))' }}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {(models || []).slice(0, 5).map((model, index) => (
                <motion.div
                  key={model.key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  <span 
                    className="text-xs md:text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {model.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 md:mt-10 pb-4"
          >
            <p 
              className="text-xs flex items-center justify-center gap-2 flex-wrap"
              style={{ color: 'var(--text-muted)' }}
            >
              <span 
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md border"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                <HiSparkles className="w-3 h-3 text-purple-500" />
                <span style={{ color: 'var(--text-tertiary)' }}>Pro tip</span>
              </span>
              <span>Click any card above or start typing to begin</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

export default WelcomeScreen;