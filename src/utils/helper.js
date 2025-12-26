import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

/**
 * Format timestamp for display
 */
export const formatTimestamp = (date) => {
  if (!date) return "";
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return "";

  if (isToday(d)) {
    return format(d, "h:mm a");
  }

  if (isYesterday(d)) {
    return `Yesterday ${format(d, "h:mm a")}`;
  }

  return format(d, "MMM d, h:mm a");
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";
  
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "New Chat";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  if (!text) return false;
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};