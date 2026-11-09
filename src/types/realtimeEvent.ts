
export type EventType = "info" | "warning" | "error";

export interface RealtimeEvent {
  id: string;
  timestamp: string;
  type: EventType;
  message: string;
}

export function parseEvent(data: string): RealtimeEvent | null {
  try {
    const parsed: unknown = JSON.parse(data);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }

    const event = parsed as Record<string, unknown>;

    if (
      typeof event.id !== "string" ||
      event.id.trim() === "" ||
      typeof event.timestamp !== "string" ||
      !Number.isFinite(Date.parse(event.timestamp)) ||
      !["info", "warning", "error"].includes(
        String(event.type)
      ) ||
      typeof event.message !== "string" ||
      event.message.trim() === ""
    ) {
      return null;
    }

    return {
      id: event.id,
      timestamp: event.timestamp,
      type: event.type as EventType,
      message: event.message,
    };
  } catch {
    return null;
  }
}
