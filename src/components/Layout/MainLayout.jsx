import React, { useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "./Header";
import { ChatContainer } from "../Chat/ChatContainer";
import { SettingsModal } from "../common/SettingsModal";
import { useChatContext } from "../../context/ChatContext";

export const MainLayout = memo(() => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    setSettingsOpen, 
    settingsOpen,
    darkMode,
    newChat 
  } = useChatContext();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + B - Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      
      // Ctrl/Cmd + / - Focus input
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        document.querySelector("textarea")?.focus();
      }

      // Ctrl/Cmd + , - Open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setSettingsOpen(true);
      }

      // Ctrl/Cmd + N - New chat
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        newChat();
      }

      // Escape - Close modals
      if (e.key === "Escape") {
        setSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSidebarOpen, setSettingsOpen, newChat]);

  return (
    <div 
      className="relative flex h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: darkMode 
              ? 'rgba(139, 92, 246, 0.12)' 
              : 'rgba(139, 92, 246, 0.06)',
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: darkMode 
              ? 'rgba(59, 130, 246, 0.12)' 
              : 'rgba(59, 130, 246, 0.06)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            opacity: darkMode ? 0.02 : 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='${darkMode ? '%23ffffff' : '%23000000'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
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
      <div className="relative flex-1 flex flex-col min-w-0 z-10">
        <Header />
        
        <main className="flex-1 overflow-hidden relative">
          <ChatContainer />
        </main>

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
});

// Footer Component
const Footer = memo(({ darkMode }) => (
  <div 
    className="relative z-10 flex-shrink-0 border-t backdrop-blur-sm transition-colors duration-300"
    style={{
      backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(255, 255, 255, 0.8)',
      borderColor: 'var(--border-primary)',
    }}
  >
    <div className="flex items-center justify-center py-2 px-4">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Powered by{" "}
        <span className="text-purple-500 font-medium">Multiple AI Models</span>
        {" "}•{" "}
        <span style={{ color: 'var(--text-tertiary)' }}>Built with ❤️</span>
      </p>
    </div>
  </div>
));

Footer.displayName = "Footer";
MainLayout.displayName = "MainLayout";

export default MainLayout;