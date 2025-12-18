import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "./Header";
import { ChatContainer } from "../Chat/ChatContainer";

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

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