
import { useRemoteSession } from "../hooks/useRemoteSession";

const statusLabels = {
  disconnected: "Disconnected",
  connecting: "Connecting",
  connected: "Connected",
  disconnecting: "Disconnecting",
  error: "Connection Error",
};

export default function RemoteDesktop() {
  const {
    status,
    errorMessage,
    connect,
    disconnect,
    simulateError,
  } = useRemoteSession();

  const isConnected = status === "connected";

  const canConnect =
    status === "disconnected" || status === "error";

  const canDisconnect =
    status === "connected" || status === "connecting";

  return (
    <main className="remote-desktop">
      <section className="overview-grid" aria-label="Remote session overview">
        <article className="panel overview-card">
          <span className="eyebrow">REMOTE SESSION STATUS</span>

          <h2 className="connection-title">
            {statusLabels[status]}
          </h2>

          <p className="endpoint">Mock VNC Session</p>

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
              disabled={!canDisconnect}
            >
              Disconnect
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={simulateError}
              disabled={
                status !== "connected" &&
                status !== "connecting"
              }
            >
              Simulate Error
            </button>
          </div>
        </article>

        <article className="panel overview-card">
          <span className="eyebrow">SESSION INFORMATION</span>

          <h2 className="connection-title">
            {isConnected ? "Session Active" : "No Active Session"}
          </h2>

          <p className="endpoint">Protocol: VNC (Mock)</p>
          <p className="endpoint">Mode: Simulation</p>
        </article>
      </section>

      <section
        className="panel console-panel"
        aria-labelledby="remote-heading"
      >
        <div className="console-header">
          <div>
            <span className="eyebrow">REMOTE ACCESS</span>
            <h2 id="remote-heading">Remote Desktop Viewer</h2>
          </div>

          <span className={`status-badge status-${status}`} role="status">
            <span className="status-dot" aria-hidden="true" />
            {statusLabels[status]}
          </span>
        </div>

        <div className={`remote-screen remote-${status}`}>
          {isConnected ? (
            <div className="mock-desktop">
              <div className="mock-desktop-topbar">
                <span>BLACK NODE OS</span>
                <span>Remote Session</span>
              </div>

              <div className="mock-desktop-content">
                <div className="mock-desktop-icon" aria-hidden="true">
                  &gt;_
                </div>
                <h3>Remote Desktop Connected</h3>
                <p>Mock session is running successfully.</p>
              </div>

              <div className="mock-desktop-taskbar">
                <span>● BLACK NODE</span>
                <span>Simulation Mode</span>
              </div>
            </div>
          ) : (
            <div className="remote-placeholder">
              <div className="empty-icon" aria-hidden="true">
                &gt;_
              </div>

              <h3>{statusLabels[status]}</h3>

              <p>
                {status === "connecting"
                  ? "Establishing remote desktop session..."
                  : status === "disconnecting"
                    ? "Closing remote desktop session..."
                    : status === "error"
                      ? "Unable to establish remote connection."
                      : "Connect to start a remote desktop session."}
              </p>
            </div>
          )}
        </div>
      </section>

      {errorMessage && (
        <div className="error-alert" role="alert">
          <strong>Remote session error</strong>
          <span>{errorMessage}</span>
        </div>
      )}
    </main>
  );
}
