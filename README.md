# BLACK NODE — Frontend Engineering Technical Assessment

A responsive React + TypeScript application built for the **BLACK NODE Frontend Internship** technical assessment. It includes all three Frontend track assignments: a WebSocket connection panel, a real-time JSON events viewer, and a simulated remote desktop interface.

The project emphasizes understandable state transitions, resilient connection handling, maintainable component boundaries, responsive design, and automated tests.

## Features

### Task 1 — Real-Time WebSocket Connection Panel

- Connect to and disconnect from a local WebSocket echo server.
- Send text messages and display received responses in real time.
- Show connection status: `disconnected`, `connecting`, `connected`, `disconnecting`, or `error`.
- Handle unexpected disconnects, manual retries, and duplicate connection actions.
- Display sent/received message history and counts.
- Scroll automatically when the user is near the bottom, without interrupting history reading.
- Close the connection when the component unmounts.

### Task 2 — Real-Time Events Viewer

- Subscribe to JSON events via a separate WebSocket endpoint.
- Validate incoming IDs, timestamps, types, and messages through `parseEvent`.
- Display event type (`info`, `warning`, `error`), message, and timestamp.
- Filter by event type or show all events.
- Track event statistics and count rejected malformed messages.
- Display new events without a page refresh and preserve reading position when scrolling through history.
- Show connection, empty, and error states.

The events are **simulated test data**, generated about every two seconds. An event with type `error` represents example event content, not necessarily a failure of the WebSocket connection.

### Task 3 — Basic VNC / Remote Desktop Interface

- Simulate connecting to and disconnecting from a remote desktop session.
- Display `disconnected`, `connecting`, `connected`, `disconnecting`, and `error` states.
- Render a clearly marked mock remote desktop viewport when connected.
- Simulate a session failure, display an error, and allow manual retry.
- Support disconnecting while a connection is in progress.
- Prevent repeated connection attempts and clean up pending timers when leaving the screen.

**Mock implementation / noVNC integration point:** Task 3 does not use a real VNC server, credentials, or a live remote desktop. `src/hooks/useRemoteSession.ts` simulates the session lifecycle using timers; `src/components/RemoteDesktop.tsx` renders the mock viewport and session controls. For future real integration, a noVNC client would be initialized and disposed in the session lifecycle, the client display would mount within the remote desktop viewport, and its connection, disconnect, and error events would update the same UI states. This integration is **not implemented** in this assessment.

## Tech Stack

- React and TypeScript
- Vite and CSS
- Native browser WebSocket API
- Node.js and the `ws` package (local test server)
- Vitest, React Testing Library, and jsdom

## Project Structure

```text
server/
  index.cjs
src/
  components/
    WebSocketPanel.tsx
    EventsViewer.tsx
    RemoteDesktop.tsx
    RemoteDesktop.test.tsx
  hooks/
    useWebSocket.ts
    useWebSocket.test.ts
    useRealtimeEvents.ts
    useRealtimeEvents.test.ts
    useRemoteSession.ts
    useRemoteSession.test.ts
  types/
    realtimeEvent.ts
    realtimeEvent.test.ts
    remoteSession.ts
  utils/
    filterEvents.ts
    filterEvents.test.ts
  App.tsx
  App.css
  index.css
  main.tsx
package.json
README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Port `8080` available for the local WebSocket server (Tasks 1 and 2 only)

### Clone and install

```bash
git clone https://github.com/farhaghallab3/WebSocket-Control-Panel.git
cd WebSocket-Control-Panel
npm ci
```

### Run the server for Tasks 1 and 2

In the first terminal, from the project root:

```bash
node server/index.cjs
```

| Endpoint | Use |
| --- | --- |
| `ws://localhost:8080/` | Task 1 — Echo messages with the `Echo: ` prefix |
| `ws://localhost:8080/events` | Task 2 — Simulated JSON event stream |

### Run the frontend

In a second terminal:

```bash
npm run dev
```

Open the local URL printed by Vite and select **WebSocket Panel**, **Events Viewer**, or **Remote Desktop** from the navigation.

**Task 3 works without starting the WebSocket server.** It is a browser-only simulation; no VNC/noVNC endpoint is required.

## Tests and Quality Checks

```bash
npm run test
npm run build
npm run lint
```

Latest **user-reported local** verification on **November 9, 2026**:

| Test suite | Passed |
| --- | ---: |
| `useWebSocket` | 10 |
| `useRealtimeEvents` | 7 |
| `parseEvent` | 12 |
| `filterEvents` | 6 |
| `useRemoteSession` | 8 |
| `RemoteDesktop` component integration | 5 |
| **Total** | **48 / 48** |

The reported production build and ESLint run also passed. Manual responsive checks were reported successful at **320px, 375px, 768px, and 1440px**, along with navigation and connection-state smoke tests. These are local results, not a claim of GitHub Actions CI execution.

## Manual Verification

**Task 1:** Start the local server, connect, send `Hello`, confirm `Echo: Hello`, disconnect, and reconnect. Stop the server while connected to inspect unexpected-disconnection feedback.

**Task 2:** Start the server, connect to the event stream, verify incoming events and timestamps, switch between All/Info/Warning/Error filters, scroll up to read older events, then disconnect and reconnect.

**Task 3:** Select Remote Desktop (no server needed), click Connect, observe the connecting state and mock desktop, then Disconnect. Try disconnecting while connecting; reconnect and click Simulate Error; confirm error feedback and successful manual retry. Switching tabs unmounts the previous task view.

## Architecture and Design Decisions

- **Shared WebSocket hook:** `useWebSocket` owns the connection lifecycle, message state, and cleanup for Tasks 1 and 2.
- **Event boundary:** `useRealtimeEvents` adapts received text into validated events; `parseEvent` rejects malformed payloads and `filterEvents` supplies independently tested filtering logic.
- **Mock remote-session boundary:** `useRemoteSession` owns the Task 3 simulated connection state, guards, timers, and retry logic, independently of its UI.
- **Refs and React state:** Refs track mutable socket/timer/scroll values; state updates UI. Cleanup prevents lingering connections or timers after unmounting.
- **Accessibility and responsive layout:** Labeled controls, feedback for connection state and errors, and layouts designed for small and large screens.

## Assumptions and Limitations

- WebSocket URLs are configured for **local development**; hosted use would require configurable endpoints and a reachable WebSocket server.
- Reconnection is manual, not automatic.
- Message and event history is held in component memory; refreshing the page or switching tasks resets the relevant component state.
- Events are generated as test data and are not live infrastructure monitoring.
- Task 3 is a **mock VNC interface only**: no VNC protocol communication, noVNC package, remote host, or actual desktop interaction.
- No credentials, API keys, customer information, or sensitive infrastructure are included. Authentication, persistence, and production deployment are outside the assessment scope.

## Assessment

Developed for the **BLACK NODE Frontend Internship** technical assignments. The three tasks share a consistent dashboard design while keeping networking, validation, simulation, and presentation responsibilities separate.
