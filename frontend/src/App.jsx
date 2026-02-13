import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 Real-time Kanban Board</h1>
        <p className="subtitle">WebSocket-Powered Task Management</p>
      </header>
      <KanbanBoard />
    </div>
  );
}

export default App;
