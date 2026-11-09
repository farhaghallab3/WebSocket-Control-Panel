
const { WebSocketServer, WebSocket } = require("ws");

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

const eventTemplates = [
  {
    type: "info",
    message: "System is running normally",
  },
  {
    type: "warning",
    message: "High memory usage detected",
  },
  {
    type: "error",
    message: "Service connection failed",
  },
  {
    type: "info",
    message: "New client connected",
  },
];

function createEvent() {
  const template =
    eventTemplates[
      Math.floor(Math.random() * eventTemplates.length)
    ];

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: template.type,
    message: template.message,
  };
}

wss.on("connection", (socket, request) => {
  const path = new URL(
    request.url || "/",
    "http://localhost"
  ).pathname;

  console.log(`Client connected to ${path}`);

  // Task 1: Echo Server
  if (path === "/") {
    socket.on("message", (data) => {
      const message = data.toString();

      console.log("Received:", message);

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(`Echo: ${message}`);
      }
    });
  }

  // Task 2: Real-Time JSON Events
  else if (path === "/events") {
    const sendEvent = () => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const event = createEvent();

      socket.send(JSON.stringify(event));

      console.log("Event sent:", event);
    };

    // Send first event immediately
    sendEvent();

    // Send a new event every 2 seconds
    const interval = setInterval(sendEvent, 2000);

    socket.on("close", () => {
      clearInterval(interval);
      console.log("Events client disconnected");
    });

    socket.on("error", (error) => {
      console.error("Events socket error:", error.message);
    });
  }

  // Unknown endpoint
  else {
    socket.close(1008, "Unknown endpoint");
  }

  socket.on("close", () => {
    console.log(`Client disconnected from ${path}`);
  });
});

wss.on("listening", () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Task 1: ws://localhost:${PORT}/`);
  console.log(`Task 2: ws://localhost:${PORT}/events`);
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error.message);
});
