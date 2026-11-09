import { useEffect, useRef, useState, type FormEvent } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import "./App.css";

const WS_URL = "ws://localhost:8080";

const statusLabels = {
  disconnected: "Disconnected",
  connecting: "Connecting",
  connected: "Connected",
  disconnecting: "Disconnecting",
  error: "Connection Error",
};

function App() {
  const {
    status,
    messages,
    errorMessage,
    connect,
    disconnect,
    sendMessage,
  } = useWebSocket(WS_URL);

  const [input, setInput] = useState("");
  
const messageListRef = useRef<HTMLDivElement>(null);
const shouldAutoScrollRef = useRef(true);

const handleMessageScroll = () => {
  const element = messageListRef.current;
  if (!element) return;

  const distanceFromBottom =
    element.scrollHeight -
    element.scrollTop -
    element.clientHeight;

  shouldAutoScrollRef.current = distanceFromBottom < 48;
};

useEffect(() => {
  const element = messageListRef.current;

  if (element && shouldAutoScrollRef.current) {
    element.scrollTop = element.scrollHeight;
  }
}, [messages]);


  const isConnected = status === "connected";
  const canConnect =
    status === "disconnected" || status === "error";

  const sentCount = messages.filter(
    (message) => message.direction === "sent"
  ).length;

  const receivedCount = messages.filter(
    (message) => message.direction === "received"
  ).length;

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = input.trim();
    if (!text) return;

    if (sendMessage(text)) {
      setInput("");
    }
  };

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
              <p>WebSocket Control Panel</p>
            </div>
          </div>

          
<span
  className={`status-badge status-${status}`}
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  <span className="status-dot" aria-hidden="true" />
  {statusLabels[status]}
</span>

        </header>

        <main>
          <section
            className="overview-grid"
            aria-label="Connection overview"
          >
            <article className="panel overview-card">
              <span className="eyebrow">CONNECTION STATUS</span>

              <h2 className="connection-title">
                {statusLabels[status]}
              </h2>

              <p className="endpoint">{WS_URL}</p>

              <div className="connection-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={connect}
                  disabled={!canConnect}
                >
                  Connect
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={disconnect}
                  disabled={
                    status !== "connected" &&
                    status !== "connecting"
                  }
                >
                  Disconnect
                </button>
              </div>
            </article>

            <article className="panel overview-card">
              <span className="eyebrow">MESSAGE ACTIVITY</span>

              <h2 className="message-total">
                {messages.length}
              </h2>

              <div className="activity-stats">
                <span>↑ {sentCount} sent</span>
                <span>↓ {receivedCount} received</span>
              </div>
            </article>
          </section>

          <section
            className="panel console-panel"
            aria-labelledby="console-heading"
          >
            <div className="console-header">
              <div>
                <span className="eyebrow">REAL-TIME DATA</span>
                <h2 id="console-heading">Message Console</h2>
              </div>

              <span className="console-count">
                {messages.length} messages
              </span>
            </div>

            <div
              className="message-list"
              role="log"
              ref={messageListRef}
              onScroll={handleMessageScroll}
              aria-label="WebSocket messages"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon" aria-hidden="true">
                    &gt;_
                  </div>

                  <h3>No messages yet</h3>
                  <p>
                    Connect to the server and send your
                    first message.
                  </p>
                </div>
              ) : (
                <ul className="messages">
                  {messages.map((message) => (
                    <li
                      className="message-row"
                      key={message.id}
                    >
                      <span
                        className={`message-tag ${message.direction}`}
                      >
                        {message.direction === "sent"
                          ? "SENT"
                          : "RECV"}
                      </span>

                      <span className="message-text">
                        {message.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form
              className="message-composer"
              onSubmit={handleSend}
            >
              <label className="sr-only" htmlFor="message-input">
                Message
              </label>

              <input
                id="message-input"
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder={
                  isConnected
                    ? "Type your message..."
                    : "Connect to send messages..."
                }
                disabled={!isConnected}
              />

              <button
                type="submit"
                className="btn btn-primary send-button"
                disabled={!isConnected || !input.trim()}
              >
                Send <span aria-hidden="true">↗</span>
              </button>
            </form>
          </section>

          {errorMessage && (
            <div className="error-alert" role="alert">
              <strong>Connection issue</strong>
              <span>{errorMessage}</span>
            </div>
          )}
        </main>

        <footer className="dashboard-footer">
          <span>BLACK NODE / FRONTEND TASK 01</span>
          <span>React · TypeScript · WebSocket</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
