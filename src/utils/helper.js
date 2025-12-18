import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export const formatTimestamp = (date) => {
  const d = new Date(date);

  if (isToday(d)) {
    return format(d, "h:mm a");
  }

  if (isYesterday(d)) {
    return `Yesterday ${format(d, "h:mm a")}`;
  }

  return format(d, "MMM d, h:mm a");
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return "New Chat";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};