# BLACK NODE — WebSocket Control Panel

A responsive, real-time WebSocket control panel built with React, TypeScript, and Vite as part of the BLACK NODE Frontend Internship technical assessment.

## Overview

This application demonstrates client-side WebSocket connection management through a reusable React hook and a monitoring interface.

The focus is on connection lifecycle management, predictable state transitions, error handling, and testability.

## Features

- Connect to and disconnect from a WebSocket server
- Send and receive messages in real time
- Display connection states: disconnected, connecting, connected, disconnecting, and error
- Handle unexpected disconnections and support manual reconnection
- Prevent duplicate connection and disconnection actions
- Display sent and received message activity
- Preserve message history during reconnection
- Automatically scroll to new messages while respecting manual scrolling
- Responsive dark-themed monitoring interface
- Accessible connection feedback and form controls

## Tech Stack

- React
- TypeScript
- Vite
- Native WebSocket API
- CSS
- Vitest
- React Testing Library
- jsdom

## Project Structure

```text
black-node-frontend/
├── src/
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   └── useWebSocket.test.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A WebSocket server accessible at `ws://localhost:8080`

### Installation

```bash
npm install
```

### Run the application

```bash
npm run dev
```

Open the local URL displayed by Vite.

### WebSocket Server


This project includes a local WebSocket echo server built with the `ws` library.

The server listens on port `8080` and sends received messages back to the client with an `Echo:` prefix.

#### Start the server

Open a terminal in the project root and run:

```bash
node server/index.cjs
```

The server will be available at:

```text
ws://localhost:8080
```

#### Start the frontend

Open a second terminal and run:

```bash
npm run dev
```

Open the URL provided by Vite.

#### Test the connection

1. Click **Connect**.
2. Verify the status changes to **Connected**.
3. Send a message such as `Hello`.
4. Verify the response `Echo: Hello` appears.
5. Click **Disconnect** and verify the status changes to **Disconnected**.

To simulate an unexpected server shutdown, stop the server using `Ctrl + C` while the client is connected.

The frontend and WebSocket server must run in separate terminal processes.


## Testing

Run automated tests:

```bash
npm run test
```

Run the production build:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

The test suite covers connection initialization, successful connections, message handling, blocked sends, intentional disconnections, reconnection after failure, component cleanup, unexpected disconnections, and duplicate-action protection.

## Technical Decisions

### Custom useWebSocket Hook

WebSocket connection logic is separated from the UI to improve maintainability, reuse, and testability.

### useRef vs useState

`useRef` stores the WebSocket instance without triggering unnecessary re-renders.

`useState` manages connection status, messages, and error feedback because changes to these values need to update the interface.

### Connection Lifecycle

The hook tracks connection states and prevents conflicting actions while a connection is opening or closing.

### Error Handling

Unexpected disconnections produce error feedback. Users can manually reconnect after a failed connection.

### Resource Cleanup

The hook closes the active WebSocket when its consuming component unmounts.

### Testing Strategy

A mocked WebSocket implementation is used to test lifecycle events without depending on a live server.

Manual testing complements the automated suite.

## Scope and Limitations

- The application uses a configurable local WebSocket endpoint defined in the frontend code.
- Automatic reconnection is not implemented; reconnection is user-initiated.
- Messages are stored in React state and are not persisted across page reloads.
- Authentication and production WebSocket infrastructure are outside the current implementation.

## Assessment

Developed for the BLACK NODE Frontend Internship technical assessment.

The implementation prioritizes clarity, reliability, maintainability, and understandable engineering decisions.