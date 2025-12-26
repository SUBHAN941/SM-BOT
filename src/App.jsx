import React from "react";
import { ChatProvider } from "./context/ChatContext";
import { MainLayout } from "./components/Layout/MainLayout";
// import "./styles/globals.css";

function App() {
  return (
    <ChatProvider>
      <MainLayout />
    </ChatProvider>
  );
}

export default App;