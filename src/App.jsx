import React from "react";
import { ChatProvider } from "./context/ChatContext";
import { MainLayout } from "./components/Layout/MainLayout";

function App() {
  return (
    <ChatProvider>
      <MainLayout />
    </ChatProvider>
  );
}

export default App;