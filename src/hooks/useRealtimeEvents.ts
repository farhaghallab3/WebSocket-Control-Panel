
import { useMemo } from "react";
import { useWebSocket } from "./useWebSocket";
import {
  parseEvent,
  type RealtimeEvent,
} from "../types/realtimeEvent";

const EVENTS_URL = "ws://localhost:8080/events";

export function useRealtimeEvents() {
  const {
    status,
    messages,
    errorMessage,
    connect,
    disconnect,
  } = useWebSocket(EVENTS_URL);

  const events = useMemo<RealtimeEvent[]>(() => {
    return messages
      .filter((message) => message.direction === "received")
      .map((message) => parseEvent(message.text))
      .filter((event): event is RealtimeEvent => event !== null);
  }, [messages]);

  const invalidEventCount = useMemo(() => {
    return messages.filter(
      (message) =>
        message.direction === "received" &&
        parseEvent(message.text) === null
    ).length;
  }, [messages]);

  return {
    status,
    events,
    invalidEventCount,
    errorMessage,
    connect,
    disconnect,
  };
}
