
import { useState } from "react";
import WebSocketPanel from "./components/WebSocketPanel";
import EventsViewer from "./components/EventsViewer";
import "./App.css";

type ActiveTask = "websocket" | "events";

function App() {
  const [activeTask, setActiveTask] =
    useState<ActiveTask>("events");

  return (
    <>
      <nav className="task-navigation" aria-label="Task navigation">
        <button
          type="button"
          className={`task-tab ${
            activeTask === "websocket" ? "active" : ""
          }`}
          onClick={() => setActiveTask("websocket")}
          aria-current={
            activeTask === "websocket" ? "page" : undefined
          }
        >
          Task 1 — WebSocket Panel
        </button>

        <button
          type="button"
          className={`task-tab ${
            activeTask === "events" ? "active" : ""
          }`}
          onClick={() => setActiveTask("events")}
          aria-current={
            activeTask === "events" ? "page" : undefined
          }
        >
          Task 2 — Events Viewer
        </button>
      </nav>

      {activeTask === "websocket" ? (
        <WebSocketPanel />
      ) : (
        <div className="app-shell">
          <div className="dashboard">
            <header className="dashboard-header">
              <div className="brand">
                <div className="brand-icon" aria-hidden="true">
                  &gt;_
                </div>

                <div>
                  <h1>BLACK NODE</h1>
                  <p>Real-Time Events Viewer</p>
                </div>
              </div>
            </header>

            <EventsViewer />

            <footer className="dashboard-footer">
              <span>BLACK NODE / FRONTEND TASK 02</span>
              <span>React · TypeScript · WebSocket</span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
