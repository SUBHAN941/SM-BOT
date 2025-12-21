import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  FaCopy, 
  FaCheck, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaRedo, 
  FaEdit, 
  FaDownload,
  FaExpand,
  FaTimes,
  FaCode
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { Avatar } from "../common/Avatar";
import { TypingIndicator } from "../common/LoadingSpinner";
import { formatTimestamp, copyToClipboard } from "../../utils/helper";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

export const ChatMessage = ({ message, onRegenerate, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState({});
  const [imageStatus, setImageStatus] = useState("loading");
  const [showFullImage, setShowFullImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [reaction, setReaction] = useState(message.userReaction || null);
  const [isHovered, setIsHovered] = useState(false);

  const { handleReaction } = useChatContext();
  const isUser = message.role === "user";
  const hasImage = message.image && message.image.url;

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCodeCopy = async (code, id) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCodeCopied({ ...codeCopied, [id]: true });
      setTimeout(() => setCodeCopied({ ...codeCopied, [id]: false }), 2000);
    }
  };

  const handleLike = () => {
    if (reaction !== "like") {
      setReaction("like");
      handleReaction?.(message.id, "like");
    }
  };

  const handleDislike = () => {
    if (reaction !== "dislike") {
      setReaction("dislike");
      handleReaction?.(message.id, "dislike");
    }
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(false);
  };

  const handleImageDownload = async () => {
    if (hasImage) {
      try {
        const response = await fetch(message.image.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `generated-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group px-4 py-6 transition-all duration-300 ${
        isUser 
          ? "bg-gradient-to-r from-gray-800/60 via-gray-800/40 to-gray-800/60" 
          : "bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900"
      }`}
    >
      {/* Subtle side accent line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-b from-blue-500 via-blue-600 to-blue-500"
            : "bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500"
        } ${isHovered ? "opacity-100" : "opacity-0"}`}
      />

      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Avatar with glow effect */}
        <div className="relative flex-shrink-0">
          <div
            className={`absolute -inset-1 rounded-full blur-md transition-opacity duration-300 ${
              isUser
                ? "bg-blue-500/30"
                : "bg-purple-500/30"
            } ${isHovered ? "opacity-100" : "opacity-0"}`}
          />
          <div className="relative">
            <Avatar type={isUser ? "user" : "assistant"} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`font-semibold text-sm ${
              isUser ? "text-blue-400" : "text-purple-400"
            }`}>
              {isUser ? "You" : (
                <span className="flex items-center gap-1.5">
                  <HiSparkles className="w-4 h-4 animate-pulse" />
                  AI Assistant
                </span>
              )}
            </span>
            
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-gray-600" />
              {formatTimestamp(message.timestamp)}
            </span>
            
            {message.model && (
              <span className="text-xs bg-gradient-to-r from-gray-700 to-gray-800 px-2.5 py-1 rounded-full text-gray-300 border border-gray-600/50 shadow-sm">
                {message.model}
              </span>
            )}
            
            {message.edited && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/30"
              >
                ✏️ edited
              </motion.span>
            )}
            
            {message.regenerated && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30"
              >
                🔄 regenerated
              </motion.span>
            )}
          </div>

          {/* Content or Edit Mode */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3"
              >
                <div className="relative">
                  {/* Animated border */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-xl opacity-75 blur-[1px]" 
                    style={{ backgroundSize: "200% 100%", animation: "gradientShift 3s linear infinite" }} 
                  />
                  
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="relative w-full bg-gray-800 text-white rounded-xl p-4 border-0 focus:outline-none resize-none min-h-[120px]"
                    rows={4}
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all duration-300"
                  >
                    Save & Submit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-xl font-medium transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`prose prose-invert max-w-none ${
                  message.isError ? "text-red-400" : "text-gray-100"
                }`}
              >
                {message.isStreaming && !message.content ? (
                  <TypingIndicator />
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="text-gray-100 mb-4 leading-relaxed text-[15px]">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-white text-2xl font-bold mt-6 mb-3 flex items-center gap-2">
                          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-white text-xl font-bold mt-5 mb-3 flex items-center gap-2">
                          <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-white text-lg font-semibold mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="text-gray-100 space-y-2 mb-4 ml-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="text-gray-100 space-y-2 mb-4 ml-2 list-decimal list-inside">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-100 flex items-start gap-2">
                          <span className="text-purple-400 mt-1.5">•</span>
                          <span>{children}</span>
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-white font-semibold">
                          {children}
                        </strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-purple-500/50 pl-4 py-2 my-4 bg-purple-500/5 rounded-r-lg italic text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors"
                        >
                          {children}
                        </a>
                      ),
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeId = String(children).slice(0, 20);
                        
                        return !inline && match ? (
                          <div className="relative group/code my-5">
                            {/* Language badge */}
                            <div className="absolute -top-3 left-4 z-10">
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-800 text-xs text-gray-300 rounded-full border border-gray-600/50 shadow-lg">
                                <FaCode className="w-3 h-3 text-purple-400" />
                                {match[1]}
                              </span>
                            </div>
                            
                            {/* Copy button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCodeCopy(String(children), codeId)}
                              className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-700/90 hover:bg-gray-600 text-xs text-gray-300 rounded-lg opacity-0 group-hover/code:opacity-100 transition-all duration-200 border border-gray-600/50"
                            >
                              {codeCopied[codeId] ? (
                                <>
                                  <FaCheck className="w-3 h-3 text-green-400" />
                                  <span className="text-green-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <FaCopy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </motion.button>
                            
                            {/* Code block container */}
                            <div className="relative rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50" />
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="!bg-transparent !m-0 !pt-8"
                                customStyle={{
                                  background: "transparent",
                                  padding: "1.5rem",
                                  paddingTop: "2rem",
                                  fontSize: "0.875rem",
                                  lineHeight: "1.6",
                                }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        ) : (
                          <code
                            className="bg-gray-800/80 px-2 py-1 rounded-md text-sm text-pink-400 font-mono border border-gray-700/50"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Image */}
          <AnimatePresence>
            {hasImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-5"
              >
                {imageStatus === "loading" && (
                  <div className="relative w-80 h-80 rounded-2xl overflow-hidden">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-gray-800 to-pink-900/40 animate-pulse" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center border border-gray-700/50 rounded-2xl">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-purple-500/30 rounded-full" />
                        <div className="absolute inset-0 w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-gray-400 mt-4 text-sm font-medium">Creating your image...</p>
                      <p className="text-gray-500 text-xs mt-1">This may take a moment</p>
                    </div>
                  </div>
                )}
                
                {imageStatus === "error" && (
                  <div className="w-80 h-40 bg-red-900/20 rounded-2xl border border-red-500/30 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-red-400 text-sm">Failed to load image</p>
                      <p className="text-red-400/60 text-xs mt-1">Please try regenerating</p>
                    </div>
                  </div>
                )}
                
                {imageStatus === "loaded" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group/image inline-block"
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                      <img
                        src={message.image.url}
                        alt={message.image.prompt}
                        className="max-w-md rounded-2xl cursor-pointer transition-transform duration-300 group-hover/image:scale-[1.02]"
                        onClick={() => setShowFullImage(true)}
                      />
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                          <p className="text-white text-sm truncate max-w-[200px]">
                            {message.image.prompt}
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFullImage(true);
                              }}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                            >
                              <FaExpand className="w-4 h-4 text-white" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageDownload();
                              }}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                            >
                              <FaDownload className="w-4 h-4 text-white" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Hidden image for preloading */}
                <img
                  src={message.image.url}
                  className="hidden"
                  onLoad={() => setImageStatus("loaded")}
                  onError={() => setImageStatus("error")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full Image Modal */}
          <AnimatePresence>
            {showFullImage && hasImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setShowFullImage(false)}
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
                
                {/* Image container */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="relative max-w-[90vw] max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={message.image.url}
                    className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                  />
                  
                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFullImage(false)}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors"
                  >
                    <FaTimes className="w-4 h-4 text-white" />
                  </motion.button>
                  
                  {/* Download button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleImageDownload}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 text-white text-sm transition-colors"
                  >
                    <FaDownload className="w-4 h-4" />
                    Download
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <AnimatePresence>
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1 mt-5 flex-wrap"
              >
                {/* Copy */}
                <ActionButton
                  onClick={handleCopy}
                  icon={copied ? <FaCheck className="w-3 h-3" /> : <FaCopy className="w-3 h-3" />}
                  label={copied ? "Copied!" : "Copy"}
                  active={copied}
                  activeColor="green"
                />

                {/* Edit (user messages only) */}
                {isUser && onEdit && (
                  <ActionButton
                    onClick={() => setIsEditing(true)}
                    icon={<FaEdit className="w-3 h-3" />}
                    label="Edit"
                  />
                )}

                {/* Regenerate (assistant messages only) */}
                {!isUser && onRegenerate && (
                  <ActionButton
                    onClick={() => onRegenerate(message.id)}
                    icon={<FaRedo className="w-3 h-3" />}
                    label="Regenerate"
                  />
                )}

                {/* Divider */}
                {!isUser && (
                  <div className="w-px h-4 bg-gray-700 mx-1" />
                )}

                {/* Reactions (assistant messages only) */}
                {!isUser && (
                  <>
                    <ReactionButton
                      onClick={handleLike}
                      icon={<FaThumbsUp className="w-3 h-3" />}
                      active={reaction === "like"}
                      activeColor="green"
                    />
                    <ReactionButton
                      onClick={handleDislike}
                      icon={<FaThumbsDown className="w-3 h-3" />}
                      active={reaction === "dislike"}
                      activeColor="red"
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Action Button Component
const ActionButton = ({ onClick, icon, label, active, activeColor }) => {
  const colorClasses = {
    green: "text-green-400 bg-green-500/10 border-green-500/30",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    red: "text-red-400 bg-red-500/10 border-red-500/30",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200 border ${
        active && activeColor
          ? colorClasses[activeColor]
          : "text-gray-500 hover:text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 border-transparent hover:border-gray-600/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

// Reaction Button Component
const ReactionButton = ({ onClick, icon, active, activeColor }) => {
  const activeClasses = {
    green: "text-green-400 bg-green-500/20 border-green-500/40 shadow-lg shadow-green-500/10",
    red: "text-red-400 bg-red-500/20 border-red-500/40 shadow-lg shadow-red-500/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 border ${
        active
          ? activeClasses[activeColor]
          : "text-gray-500 hover:text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 border-transparent hover:border-gray-600/50"
      }`}
    >
      <motion.div
        animate={active ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
};