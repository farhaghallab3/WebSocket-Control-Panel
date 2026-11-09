
import { useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeEvents } from "../hooks/useRealtimeEvents";
import {
  filterEvents,
  type EventFilter,
} from "../utils/filterEvents";

const filters: EventFilter[] = [
  "all",
  "info",
  "warning",
  "error",
];

export default function EventsViewer() {
  const {
    events,
    invalidEventCount,
    status,
    connect,
    disconnect,
  } = useRealtimeEvents();

  const [filter, setFilter] = useState<EventFilter>("all");

  // Filter events using the tested utility
  const filteredEvents = useMemo(
    () => filterEvents(events, filter),
    [events, filter]
  );

  // Preserve scroll position when reading history
  const eventListRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const handleEventScroll = () => {
    const element = eventListRef.current;
    if (!element) return;

    const distanceFromBottom =
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 48;
  };

  useEffect(() => {
    const element = eventListRef.current;

    if (element && shouldAutoScrollRef.current) {
      element.scrollTop = element.scrollHeight;
    }
  }, [filteredEvents]);

  // Event statistics
  const counts = {
    info: events.filter((event) => event.type === "info").length,
    warning: events.filter((event) => event.type === "warning").length,
    error: events.filter((event) => event.type === "error").length,
  };

  const canConnect =
    status === "disconnected" || status === "error";

  const canDisconnect =
    status === "connected" || status === "connecting";

  return (
    <main className="events-viewer">
      <section
        className="overview-grid"
        aria-label="Events overview"
      >
        <article className="panel overview-card">
          <span className="eyebrow">
            EVENT STREAM STATUS
          </span>

          <h2 className="connection-title">
            {status}
          </h2>

          <p className="endpoint">
            ws://localhost:8080/events
          </p>

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
          </div>
        </article>

        <article className="panel overview-card">
          <span className="eyebrow">
            EVENT ACTIVITY
          </span>

          <h2 className="message-total">
            {events.length}
          </h2>

          <div className="activity-stats">
            <span>{counts.info} info</span>
            <span>{counts.warning} warnings</span>
            <span>{counts.error} errors</span>
          </div>
        </article>
      </section>

      <section
        className="panel console-panel"
        aria-labelledby="events-heading"
      >
        <div className="console-header">
          <div>
            <span className="eyebrow">
              REAL-TIME DATA
            </span>

            <h2 id="events-heading">
              Live Event Stream
            </h2>
          </div>

          <span className="console-count">
            {filteredEvents.length} events
          </span>
        </div>

        <div
          className="event-filters"
          aria-label="Filter events"
        >
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-btn ${
                filter === item ? "active" : ""
              }`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item === "all"
                ? "All Events"
                : item.charAt(0).toUpperCase() +
                  item.slice(1)}
            </button>
          ))}
        </div>

        <div
          className="message-list"
          role="log"
          ref={eventListRef}
          onScroll={handleEventScroll}
          aria-label="Live events"
          aria-live="polite"
          aria-relevant="additions"
        >
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <h3>No events to display</h3>

              <p>
                {events.length === 0
                  ? "Connect to start receiving live events."
                  : "No events match the selected filter."}
              </p>
            </div>
          ) : (
            <ul className="messages">
              {filteredEvents.map((event) => (
                <li
                  className="message-row"
                  key={event.id}
                >
                  <span
                    className={`event-tag event-${event.type}`}
                  >
                    {event.type.toUpperCase()}
                  </span>

                  <span className="message-text">
                    {event.message}
                  </span>

                  <time
                    className="event-time"
                    dateTime={event.timestamp}
                  >
                    {new Date(
                      event.timestamp
                    ).toLocaleTimeString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {invalidEventCount > 0 && (
        <p
          className="invalid-events"
          role="status"
        >
          {invalidEventCount} invalid events ignored.
        </p>
      )}
    </main>
  );
}
