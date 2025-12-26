import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  FaCopy, 
  FaCheck, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaRedo, 
  FaEdit, 
  FaDownload,
  FaTimes,
  FaCode
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { Avatar } from "../common/Avatar";
import { formatTimestamp, copyToClipboard } from "../../utils/helper";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

// Code Block Component
const CodeBlock = memo(({ language, code, onCopy, copied, darkMode }) => (
  <div className="relative group/code my-5">
    {/* Language badge */}
    <div className="absolute -top-3 left-4 z-10">
      <span 
        className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border shadow-lg"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-secondary)',
        }}
      >
        <FaCode className="w-3 h-3 text-purple-500" />
        {language}
      </span>
    </div>
    
    {/* Copy button */}
    <button
      onClick={onCopy}
      className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg opacity-0 group-hover/code:opacity-100 transition-all duration-200 border"
      style={{
        backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(243, 244, 246, 0.9)',
        borderColor: 'var(--border-primary)',
        color: 'var(--text-secondary)',
      }}
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <FaCheck className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <FaCopy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
    
    {/* Code block - always dark for readability */}
    <div 
      className="relative rounded-xl overflow-hidden border shadow-xl"
      style={{ borderColor: darkMode ? '#374151' : '#d1d5db' }}
    >
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="!bg-[#1e1e2e] !m-0 !pt-8"
        customStyle={{
          background: "#1e1e2e",
          padding: "1.5rem",
          paddingTop: "2rem",
          fontSize: "0.875rem",
          lineHeight: "1.6",
          margin: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  </div>
));

CodeBlock.displayName = 'CodeBlock';

// Action Button Component
const ActionButton = memo(({ onClick, icon, label, active, activeColor, darkMode }) => {
  const colorClasses = {
    green: { text: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    blue: { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    red: { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  };

  const colors = active && activeColor ? colorClasses[activeColor] : null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200 border ${
        colors 
          ? `${colors.text} ${colors.bg} ${colors.border}`
          : ''
      }`}
      style={!colors ? {
        color: 'var(--text-tertiary)',
        backgroundColor: 'var(--bg-tertiary)',
        borderColor: 'transparent',
      } : undefined}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
});

ActionButton.displayName = 'ActionButton';

// Main ChatMessage Component
export const ChatMessage = memo(({ message, onRegenerate, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState({});
  const [showFullImage, setShowFullImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [reaction, setReaction] = useState(message.userReaction || null);

  const { handleReaction, selectedModel, darkMode, settings } = useChatContext();
  const isUser = message.role === "user";
  const hasImage = message.image && message.image.url;

  // Cleanup timeout
  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  // Handlers
  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(message.content);
    if (success) setCopied(true);
  }, [message.content]);

  const handleCodeCopy = useCallback(async (code, id) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCodeCopied((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCodeCopied((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }
  }, []);

  const handleLike = useCallback(() => {
    if (reaction !== "like") {
      setReaction("like");
      handleReaction?.(message.id, "like");
    }
  }, [reaction, handleReaction, message.id]);

  const handleDislike = useCallback(() => {
    if (reaction !== "dislike") {
      setReaction("dislike");
      handleReaction?.(message.id, "dislike");
    }
  }, [reaction, handleReaction, message.id]);

  const handleEditSubmit = useCallback(() => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent, selectedModel);
    }
    setIsEditing(false);
  }, [editContent, message.content, message.id, onEdit, selectedModel]);

  // Markdown components
  const markdownComponents = useMemo(() => ({
    p: ({ children }) => (
      <p 
        className="mb-4 leading-relaxed text-[15px] last:mb-0"
        style={{ color: 'var(--text-secondary)' }}
      >
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 
        className="text-2xl font-bold mt-6 mb-3 flex items-center gap-2"
        style={{ color: 'var(--text-primary)' }}
      >
        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 
        className="text-xl font-bold mt-5 mb-3 flex items-center gap-2"
        style={{ color: 'var(--text-primary)' }}
      >
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 
        className="text-lg font-semibold mt-4 mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </h3>
    ),
    ul: ({ children }) => (
      <ul className="space-y-2 mb-4 ml-4 list-disc" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-2 mb-4 ml-4 list-decimal" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li style={{ color: 'var(--text-secondary)' }}>{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        {children}
      </strong>
    ),
    blockquote: ({ children }) => (
      <blockquote 
        className="border-l-4 border-purple-500/50 pl-4 py-2 my-4 rounded-r-lg italic"
        style={{ 
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          color: 'var(--text-tertiary)',
        }}
      >
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-purple-500 hover:text-purple-400 underline decoration-purple-500/30 hover:decoration-purple-400 transition-colors"
      >
        {children}
      </a>
    ),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");
      const codeId = code.slice(0, 20);
      
      if (!inline && match) {
        return (
          <CodeBlock
            language={match[1]}
            code={code}
            copied={codeCopied[codeId]}
            onCopy={() => handleCodeCopy(code, codeId)}
            darkMode={darkMode}
          />
        );
      }
      
      return (
        <code
          className="px-2 py-1 rounded-md text-sm font-mono"
          style={{
            backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.8)' : '#fce7f3',
            color: darkMode ? '#f472b6' : '#be185d',
            border: `1px solid ${darkMode ? 'rgba(75, 85, 99, 0.5)' : '#fbcfe8'}`,
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
  }), [codeCopied, handleCodeCopy, darkMode]);

  // Message background styles
  const messageStyle = {
    backgroundColor: isUser 
      ? (darkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)')
      : 'transparent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative px-4 ${settings?.compactMode ? 'py-3' : 'py-6'} transition-all duration-300`}
      style={messageStyle}
      role="article"
      aria-label={`${isUser ? 'Your' : 'Assistant'} message`}
    >
      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar type={isUser ? "user" : "assistant"} size="md" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`font-semibold text-sm ${isUser ? "text-blue-500" : "text-purple-500"}`}>
              {isUser ? "You" : (
                <span className="flex items-center gap-1.5">
                  <HiSparkles className="w-4 h-4" />
                  AI Assistant
                </span>
              )}
            </span>
            
            {settings?.showTimestamps !== false && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatTimestamp(message.timestamp)}
              </span>
            )}
            
            {message.model && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-tertiary)',
                }}
              >
                {message.model}
              </span>
            )}
            
            {message.edited && (
              <span className="text-xs text-yellow-500">(edited)</span>
            )}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-3"
              >
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-xl p-4 border focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none min-h-[120px]"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                  rows={4}
                  autoFocus
                />
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Save & Submit
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }}
                    className="px-4 py-2 text-sm rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`prose max-w-none ${message.isError ? "text-red-500" : ""}`}
              >
                {message.isStreaming && !message.content ? (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 bg-purple-500 rounded-full"
                        />
                      ))}
                    </div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Thinking...</span>
                  </div>
                ) : (
                  <div className={message.isStreaming ? "typing-cursor" : ""}>
                    <ReactMarkdown components={markdownComponents}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image */}
          {hasImage && (
            <div className="mt-4">
              <img
                src={message.image.url}
                alt={message.image.prompt || "Generated image"}
                className="max-w-md rounded-xl border cursor-pointer hover:opacity-90 transition-opacity"
                style={{ borderColor: 'var(--border-primary)' }}
                onClick={() => setShowFullImage(true)}
              />
            </div>
          )}

          {/* Actions */}
          {!isEditing && !message.isStreaming && (
            <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ActionButton
                onClick={handleCopy}
                icon={copied ? <FaCheck className="w-3 h-3" /> : <FaCopy className="w-3 h-3" />}
                label={copied ? "Copied!" : "Copy"}
                active={copied}
                activeColor="green"
                darkMode={darkMode}
              />

              {isUser && onEdit && (
                <ActionButton
                  onClick={() => setIsEditing(true)}
                  icon={<FaEdit className="w-3 h-3" />}
                  label="Edit"
                  darkMode={darkMode}
                />
              )}

              {!isUser && onRegenerate && (
                <ActionButton
                  onClick={() => onRegenerate(message.id)}
                  icon={<FaRedo className="w-3 h-3" />}
                  label="Regenerate"
                  darkMode={darkMode}
                />
              )}

              {!isUser && (
                <>
                  <div 
                    className="w-px h-4 mx-1" 
                    style={{ backgroundColor: 'var(--border-primary)' }} 
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      reaction === "like" 
                        ? "text-green-500 bg-green-500/20" 
                        : ""
                    }`}
                    style={reaction !== "like" ? { color: 'var(--text-tertiary)' } : undefined}
                  >
                    <FaThumbsUp className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDislike}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      reaction === "dislike" 
                        ? "text-red-500 bg-red-500/20" 
                        : ""
                    }`}
                    style={reaction !== "dislike" ? { color: 'var(--text-tertiary)' } : undefined}
                  >
                    <FaThumbsDown className="w-3 h-3" />
                  </motion.button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && hasImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setShowFullImage(false)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={message.image.url}
              alt={message.image.prompt}
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;