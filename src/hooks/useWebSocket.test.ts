
 // @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { act, renderHook } from "@testing-library/react";
import { useWebSocket } from "./useWebSocket";

// Mock WebSocket for testing without a real server
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  static instances: MockWebSocket[] = [];

  url: string;
  readyState = MockWebSocket.CONNECTING;

  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;

  send = vi.fn();

  // Start closing, but don't finish immediately
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSING;
  });

  // Simulate the asynchronous close event
  finishClosing() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
}

describe("useWebSocket", () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal("WebSocket", MockWebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // TEST 1 — Initial state
  it("starts disconnected", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    expect(result.current.status).toBe("disconnected");

    act(() => {
      result.current.connect();
    });

    expect(result.current.status).toBe("connecting");

    unmount();
  });

  // TEST 2 — Successful connection
  it("changes status to connected when socket opens", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    act(() => {
      result.current.connect();
    });

    const socket = MockWebSocket.instances[0];

    act(() => {
      socket.readyState = MockWebSocket.OPEN;
      socket.onopen?.();
    });

    expect(result.current.status).toBe("connected");

    unmount();
  });

  // TEST 3 — Send and receive messages
  it("sends and receives WebSocket messages", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    act(() => {
      result.current.connect();
    });

    const socket = MockWebSocket.instances[0];

    act(() => {
      socket.readyState = MockWebSocket.OPEN;
      socket.onopen?.();
    });

    let success = false;

    act(() => {
      success = result.current.sendMessage("Hello");
    });

    expect(success).toBe(true);
    expect(socket.send).toHaveBeenCalledWith("Hello");

    act(() => {
      socket.onmessage?.({ data: "Echo: Hello" });
    });

    expect(result.current.messages).toHaveLength(2);

    expect(result.current.messages[0]).toMatchObject({
      text: "Hello",
      direction: "sent",
    });

    expect(result.current.messages[1]).toMatchObject({
      text: "Echo: Hello",
      direction: "received",
    });

    unmount();
  });

  // TEST 4 — Prevent sending while connecting
  it("prevents sending while connecting", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    act(() => {
      result.current.connect();
    });

    const socket = MockWebSocket.instances[0];

    expect(result.current.status).toBe("connecting");

    let success = true;

    act(() => {
      success = result.current.sendMessage("Hello");
    });

    expect(success).toBe(false);
    expect(socket.send).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(0);

    unmount();
  });

  // TEST 5 — Manual disconnect
  it("disconnects intentionally", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    act(() => {
      result.current.connect();
    });

    const socket = MockWebSocket.instances[0];

    act(() => {
      socket.readyState = MockWebSocket.OPEN;
      socket.onopen?.();
    });

    expect(result.current.status).toBe("connected");

    // User requests disconnection
    act(() => {
      result.current.disconnect();
    });

    expect(socket.close).toHaveBeenCalledTimes(1);
    expect(socket.readyState).toBe(MockWebSocket.CLOSING);
    expect(result.current.status).toBe("disconnecting");

    // Browser finishes closing the connection
    act(() => {
      socket.finishClosing();
    });

    expect(result.current.status).toBe("disconnected");

    unmount();
  });

  // TEST 6 — Reconnect after failure
  it("allows reconnecting after connection failure", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    act(() => {
      result.current.connect();
    });

    const firstSocket = MockWebSocket.instances[0];

    // Simulate a failed connection
    act(() => {
      firstSocket.onerror?.();
      firstSocket.readyState = MockWebSocket.CLOSED;
      firstSocket.onclose?.();
    });

    expect(result.current.status).toBe("error");

    // Retry
    act(() => {
      result.current.connect();
    });

    expect(MockWebSocket.instances).toHaveLength(2);
    expect(result.current.status).toBe("connecting");

    const secondSocket = MockWebSocket.instances[1];

    act(() => {
      secondSocket.readyState = MockWebSocket.OPEN;
      secondSocket.onopen?.();
    });

    expect(result.current.status).toBe("connected");
    expect(result.current.errorMessage).toBeNull();

    unmount();
  });

  // TEST 7 — Cleanup on unmount
  it("closes WebSocket when component unmounts", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    act(() => {
      result.current.connect();
    });

    const socket = MockWebSocket.instances[0];

    act(() => {
      socket.readyState = MockWebSocket.OPEN;
      socket.onopen?.();
    });

    expect(result.current.status).toBe("connected");

    // React removes the component
    unmount();

    expect(socket.close).toHaveBeenCalledTimes(1);
    expect(socket.readyState).toBe(MockWebSocket.CLOSING);
  });

  // TEST 8 — Unexpected disconnection
  it("handles unexpected disconnection", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost:8080")
    );

    act(() => {
      result.current.connect();
    });

    const socket = MockWebSocket.instances[0];

    act(() => {
      socket.readyState = MockWebSocket.OPEN;
      socket.onopen?.();
    });

    expect(result.current.status).toBe("connected");

    // Server closes unexpectedly
    act(() => {
      socket.readyState = MockWebSocket.CLOSED;
      socket.onclose?.();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.errorMessage).toBe(
      "Connection closed unexpectedly."
    );

    let sent = true;

    act(() => {
      sent = result.current.sendMessage("Hello");
    });

    expect(sent).toBe(false);
    expect(socket.send).not.toHaveBeenCalled();

    unmount();
  });
  
it("prevents duplicate actions while disconnecting", () => {
  const { result, unmount } = renderHook(() =>
    useWebSocket("ws://localhost:8080")
  );

  // Connect
  act(() => {
    result.current.connect();
  });

  const socket = MockWebSocket.instances[0];

  act(() => {
    socket.readyState = MockWebSocket.OPEN;
    socket.onopen?.();
  });

  // Disconnect twice
  act(() => {
    result.current.disconnect();
    result.current.disconnect();
  });

  expect(socket.close).toHaveBeenCalledTimes(1);
  expect(result.current.status).toBe("disconnecting");

  // Attempt to reconnect before closing finishes
  act(() => {
    result.current.connect();
  });

  expect(MockWebSocket.instances).toHaveLength(1);

  // Finish closing
  act(() => {
    socket.finishClosing();
  });

  expect(result.current.status).toBe("disconnected");

  // Reconnect after the old connection closes
  act(() => {
    result.current.connect();
  });

  expect(MockWebSocket.instances).toHaveLength(2);
  expect(result.current.status).toBe("connecting");

  unmount();
});

it("disconnects safely while connecting", () => {
  const { result, unmount } = renderHook(() =>
    useWebSocket("ws://localhost:8080")
  );

  act(() => {
    result.current.connect();
  });

  const socket = MockWebSocket.instances[0];

  expect(result.current.status).toBe("connecting");
  expect(socket.readyState).toBe(MockWebSocket.CONNECTING);

  // User cancels before the connection opens
  act(() => {
    result.current.disconnect();
  });

  expect(socket.close).toHaveBeenCalledTimes(1);
  expect(result.current.status).toBe("disconnecting");

  // Simulate the browser completing the close
  act(() => {
    socket.finishClosing();
  });

  expect(result.current.status).toBe("disconnected");
  expect(result.current.errorMessage).toBeNull();

  unmount();
});

});
