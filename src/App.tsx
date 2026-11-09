
import { useState } from "react";
import WebSocketPanel from "./components/WebSocketPanel";
import EventsViewer from "./components/EventsViewer";
import RemoteDesktop from "./components/RemoteDesktop";
import "./App.css";

type ActiveTask = "websocket" | "events" | "remote";

const tasks: { id: ActiveTask; label: string }[] = [
  { id: "websocket", label: "WebSocket Panel" },
  { id: "events", label: "Events Viewer" },
  { id: "remote", label: "Remote Desktop" },
];

function App() {
  const [activeTask, setActiveTask] =
    useState<ActiveTask>("remote");

  return (
    <div className="app-shell">
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="brand">
            <div className="brand-icon" aria-hidden="true">
              &gt;_
            </div>

            <div>
              <h1>BLACK NODE</h1>
              <p>Frontend Engineering Tasks</p>
            </div>
          </div>
        </header>

        <nav className="task-navigation" aria-label="Task navigation">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              className={`task-tab ${
                activeTask === task.id ? "active" : ""
              }`}
              aria-current={
                activeTask === task.id ? "page" : undefined
              }
              onClick={() => setActiveTask(task.id)}
            >
              {task.label}
            </button>
          ))}
        </nav>

        {activeTask === "websocket" && <WebSocketPanel />}
        {activeTask === "events" && <EventsViewer />}
        {activeTask === "remote" && <RemoteDesktop />}

        <footer className="dashboard-footer">
          <span>BLACK NODE / FRONTEND ENGINEERING</span>
          <span>React · TypeScript · WebSocket</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
