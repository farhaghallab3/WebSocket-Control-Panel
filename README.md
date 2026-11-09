
# BLACK NODE — WebSocket Control Panel & Real-Time Events Viewer

A responsive real-time monitoring application built with React, TypeScript, and WebSocket as part of the BLACK NODE Frontend Internship technical assessment.

The project contains two tasks, focusing on WebSocket communication, connection lifecycle management, real-time event processing, and reliable frontend architecture.

## Features

### Task 1 — WebSocket Control Panel

- Connect to and disconnect from a WebSocket server.
- Send and receive messages in real time.
- Display connection states: disconnected, connecting, connected, disconnecting, and error.
- Handle unexpected disconnections and allow manual reconnection.
- Prevent duplicate connection actions.
- Display sent and received message history.
- Show message activity statistics.
- Automatically scroll to new messages while respecting manual scrolling.
- Clean up WebSocket connections when components unmount.

### Task 2 — Real-Time Events Viewer

- Receive JSON events through a dedicated WebSocket endpoint.
- Validate incoming event data before processing.
- Display events with their type, message, and timestamp.
- Support three event types: info, warning, and error.
- Filter events by type or display all events.
- Display real-time event statistics.
- Ignore malformed events and track their count.
- Support automatic scrolling while preserving manual reading position.
- Handle connection and disconnection states.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Native WebSocket API
- Node.js
- ws (WebSocket server)
- Vitest
- React Testing Library
- jsdom

## Project Structure

```text
black-node-frontend/
├── server/
│   └── index.cjs
├── src/
│   ├── components/
│   │   ├── WebSocketPanel.tsx
│   │   └── EventsViewer.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   ├── useWebSocket.test.ts
│   │   ├── useRealtimeEvents.ts
│   │   └── useRealtimeEvents.test.ts
│   ├── types/
│   │   ├── realtimeEvent.ts
│   │   └── realtimeEvent.test.ts
│   ├── utils/
│   │   ├── filterEvents.ts
│   │   └── filterEvents.test.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- An available local port 8080

### 1. Clone the Repository

```bash
git clone https://github.com/farhaghallab3/WebSocket-Control-Panel.git
cd WebSocket-Control-Panel
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Start the WebSocket Server

Open a terminal in the project root:

```bash
node server/index.cjs
```

The server provides two WebSocket endpoints:

| Endpoint | Purpose |
|---|---|
| `ws://localhost:8080` | Task 1 — Echo messages |
| `ws://localhost:8080/events` | Task 2 — JSON event stream |

The Task 1 endpoint echoes received messages with an `Echo:` prefix.

The Task 2 endpoint generates simulated events approximately every two seconds.

### 4. Start the React Application

Open another terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite.

Keep the WebSocket server running while testing the application.

## Testing

Run all automated tests:

```bash
npx vitest run
```

Run the production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

### Latest Local Verification

| Test Suite | Passing Tests |
|---|---:|
| useWebSocket | 10 |
| useRealtimeEvents | 7 |
| parseEvent | 12 |
| filterEvents | 6 |
| **Total** | **35** |

Latest reported results:

- 35 automated tests passed.
- Production build passed.
- ESLint passed.
- Responsive checks passed at 320px, 375px, 768px, and 1440px.
- Manual integration and connection lifecycle checks passed.

These results were verified locally during development.

## Architecture & Technical Decisions

### Reusable WebSocket Hook

The `useWebSocket` hook manages the WebSocket connection lifecycle independently of the user interface.

It handles connection status, messages, sending, disconnection, error handling, and cleanup.

### React useRef and useState

`useRef` is used to store mutable values such as the WebSocket instance and auto-scroll tracking without triggering unnecessary re-renders.

`useState` is used for values that affect the rendered interface.

### Event Validation

The `parseEvent` utility validates incoming JSON data before it is accepted as a real-time event.

Invalid payloads are ignored to prevent malformed data from entering the event stream.

### Event Filtering

Filtering logic is separated into a reusable `filterEvents` utility.

This keeps the UI simpler and allows filtering behavior to be tested independently.

### Connection Lifecycle

The application handles connection states explicitly and prevents conflicting actions during connection or disconnection.

### Resource Cleanup

WebSocket connections are closed when their consuming components unmount.

The local event server also stops the corresponding event stream when a client disconnects.

## Manual Testing

### Task 1

1. Start the local WebSocket server.
2. Open the WebSocket Control Panel.
3. Connect to the server.
4. Send `Hello`.
5. Verify the response `Echo: Hello`.
6. Disconnect manually.
7. Reconnect and verify normal operation.
8. Stop the server to simulate an unexpected disconnection.

### Task 2

1. Start the local WebSocket server.
2. Open the Real-Time Events Viewer.
3. Connect to the events endpoint.
4. Verify that events appear automatically.
5. Test the All Events, Info, Warning, and Error filters.
6. Scroll up and verify that new events do not interrupt reading.
7. Disconnect and reconnect.
8. Verify event statistics and timestamps.

## Scope & Limitations

- WebSocket endpoints are configured for local development.
- Automatic reconnection is not implemented; reconnection is manual.
- Messages and events are stored in React state and are not persisted across page reloads.
- Task 2 uses simulated event data rather than real production telemetry.
- Authentication and production WebSocket infrastructure are outside the current scope.

## Assessment

Developed for the BLACK NODE Frontend Internship technical assessment.

The implementation prioritizes:

- Maintainable architecture
- Reliable connection handling
- Clear separation of concerns
- Responsive user interfaces
- Automated testing
- Predictable state management

