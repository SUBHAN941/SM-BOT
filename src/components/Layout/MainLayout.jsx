import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "./Header";
import { ChatContainer } from "../Chat/ChatContainer";
import { useChatContext } from "../../context/ChatContext";

export const MainLayout = () => {
  const { sidebarOpen, setSidebarOpen } = useChatContext();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      
      // Ctrl/Cmd + / to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        document.querySelector("textarea")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSidebarOpen]);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Global background */}
      <div className="fixed inset-0 bg-gray-950">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"
          />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative flex-1 flex flex-col min-w-0 z-10"
        animate={{
          marginLeft: sidebarOpen ? 0 : 0, // Sidebar handles its own width
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <Header />

        {/* Main chat area */}
        <main className="flex-1 overflow-hidden relative">
          {/* Top fade */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-900/50 to-transparent z-10 pointer-events-none" />
          
          {/* Chat Container */}
          <ChatContainer />
          
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-900/50 to-transparent z-10 pointer-events-none" />
        </main>

        {/* Footer - optional */}
        <Footer />
      </motion.div>
    </div>
  );
};

// Optional Footer Component
const Footer = () => {
  return (
    <div className="relative z-10 flex-shrink-0 border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-center py-2 px-4">
        <p className="text-xs text-gray-600">
          Powered by{" "}
          <span className="text-purple-400 font-medium">Multiple AI Models</span>
          {" "}•{" "}
          <span className="text-gray-500">Built with ❤️</span>
        </p>
      </div>
    </div>
  );
};

// Alternative simpler layout without animations
export const MainLayoutSimple = () => {
  const { sidebarOpen, setSidebarOpen } = useChatContext();

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
};