import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaCheck, FaThumbsUp, FaThumbsDown, FaRedo, FaEdit, FaDownload } from "react-icons/fa";
import { Avatar } from "../common/Avatar";
import { TypingIndicator } from "../common/LoadingSpinner";
import { formatTimestamp, copyToClipboard } from "../../utils/helper";
import { motion } from "framer-motion";
import { useChatContext } from "../../context/ChatContext";

export const ChatMessage = ({ message, onRegenerate, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [imageStatus, setImageStatus] = useState("loading");
  const [showFullImage, setShowFullImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [reaction, setReaction] = useState(message.userReaction || null);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 px-4 py-6 ${isUser ? "bg-gray-800/50" : "bg-gray-900"}`}
    >
      <Avatar type={isUser ? "user" : "assistant"} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-sm text-white">
            {isUser ? "You" : "AI Assistant"}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.model && (
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
              {message.model}
            </span>
          )}
          {message.edited && (
            <span className="text-xs text-yellow-500">(edited)</span>
          )}
          {message.regenerated && (
            <span className="text-xs text-blue-400">(regenerated)</span>
          )}
        </div>

        {/* Content or Edit Mode */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              rows={4}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEditSubmit}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                Save & Submit
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={`max-w-none ${message.isError ? "text-red-400" : "text-white"}`}>
            {message.isStreaming && !message.content ? (
              <TypingIndicator />
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-white mb-3 leading-relaxed">{children}</p>,
                  h1: ({ children }) => <h1 className="text-white text-2xl font-bold mt-4 mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-white text-xl font-bold mt-4 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-white text-lg font-bold mt-3 mb-2">{children}</h3>,
                  ul: ({ children }) => <ul className="text-white list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="text-white list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-white">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="relative group my-4">
                        <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="rounded-lg !bg-gray-950" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm text-pink-400" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}

        {/* Generated Image */}
        {hasImage && (
          <div className="mt-4">
            {imageStatus === "loading" && (
              <div className="w-80 h-80 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Generating...</p>
                </div>
              </div>
            )}
            {imageStatus === "loaded" && (
              <img
                src={message.image.url}
                alt={message.image.prompt}
                className="max-w-md rounded-xl border border-gray-700 cursor-pointer"
                onClick={() => setShowFullImage(true)}
              />
            )}
            <img
              src={message.image.url}
              className="hidden"
              onLoad={() => setImageStatus("loaded")}
              onError={() => setImageStatus("error")}
            />
          </div>
        )}

        {/* Full Image Modal */}
        {showFullImage && hasImage && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setShowFullImage(false)}>
            <img src={message.image.url} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
            <button onClick={() => setShowFullImage(false)} className="absolute top-4 right-4 text-white text-3xl">×</button>
          </div>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {/* Copy */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-800"
            >
              {copied ? <FaCheck className="w-3 h-3 text-green-500" /> : <FaCopy className="w-3 h-3" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            {/* Edit (user messages only) */}
            {isUser && onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-800"
              >
                <FaEdit className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}

            {/* Regenerate (assistant messages only) */}
            {!isUser && onRegenerate && (
              <button
                onClick={() => onRegenerate(message.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-800"
              >
                <FaRedo className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            )}

            {/* Reactions (assistant messages only) */}
            {!isUser && (
              <>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    reaction === "like" 
                      ? "text-green-500 bg-green-500/10" 
                      : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <FaThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    reaction === "dislike" 
                      ? "text-red-500 bg-red-500/10" 
                      : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <FaThumbsDown className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};