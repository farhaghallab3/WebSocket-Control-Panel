
// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRealtimeEvents } from "./useRealtimeEvents";
import { useWebSocket } from "./useWebSocket";

vi.mock("./useWebSocket", () => ({
  useWebSocket: vi.fn(),
}));

const mockedUseWebSocket = vi.mocked(useWebSocket);

const validInfo = {
  id: "evt-001",
  timestamp: "2026-11-09T18:06:03.475Z",
  type: "info",
  message: "System running",
};

const validWarning = {
  id: "evt-002",
  timestamp: "2026-11-09T18:06:05.475Z",
  type: "warning",
  message: "High memory usage",
};

type MockMessages = ReturnType<typeof useWebSocket>["messages"];

function mockMessages(messages: MockMessages) {
  mockedUseWebSocket.mockReturnValue({
    status: "connected",
    messages,
    errorMessage: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendMessage: vi.fn(),
  });
}

describe("useRealtimeEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("connects to the events endpoint", () => {
    mockMessages([]);

    renderHook(() => useRealtimeEvents());

    expect(mockedUseWebSocket).toHaveBeenCalledWith(
      "ws://localhost:8080/events"
    );
  });

  it("starts with an empty events list", () => {
    mockMessages([]);

    const { result } = renderHook(() => useRealtimeEvents());

    expect(result.current.events).toEqual([]);
    expect(result.current.invalidEventCount).toBe(0);
  });

  it("parses valid incoming events", () => {
    mockMessages([
      {
        id: "msg-1",
        direction: "received",
        text: JSON.stringify(validInfo),
      },
    ]);

    const { result } = renderHook(() => useRealtimeEvents());

    expect(result.current.events).toEqual([validInfo]);
    expect(result.current.invalidEventCount).toBe(0);
  });

  it("ignores malformed JSON and counts it", () => {
    mockMessages([
      {
        id: "msg-1",
        direction: "received",
        text: '{"type":',
      },
    ]);

    const { result } = renderHook(() => useRealtimeEvents());

    expect(result.current.events).toEqual([]);
    expect(result.current.invalidEventCount).toBe(1);
  });

  it("keeps valid events when one message is invalid", () => {
    mockMessages([
      {
        id: "msg-1",
        direction: "received",
        text: JSON.stringify(validInfo),
      },
      {
        id: "msg-2",
        direction: "received",
        text: "invalid-json",
      },
      {
        id: "msg-3",
        direction: "received",
        text: JSON.stringify(validWarning),
      },
    ]);

    const { result } = renderHook(() => useRealtimeEvents());

    expect(result.current.events).toEqual([
      validInfo,
      validWarning,
    ]);
    expect(result.current.invalidEventCount).toBe(1);
  });

  it("ignores outgoing messages", () => {
    mockMessages([
      {
        id: "msg-1",
        direction: "sent",
        text: JSON.stringify(validInfo),
      },
    ]);

    const { result } = renderHook(() => useRealtimeEvents());

    expect(result.current.events).toEqual([]);
    expect(result.current.invalidEventCount).toBe(0);
  });

  it("exposes connection controls", () => {
    mockMessages([]);

    const { result } = renderHook(() => useRealtimeEvents());

    expect(result.current.status).toBe("connected");
    expect(typeof result.current.connect).toBe("function");
    expect(typeof result.current.disconnect).toBe("function");
  });
});
