import React, { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { useChatContext } from "../../context/ChatContext";

export const MessageList = () => {
  const { messages } = useChatContext();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <ChatMessage key={message.id || index} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};