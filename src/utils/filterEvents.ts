
import type { RealtimeEvent } from "../types/realtimeEvent";

export type EventFilter =
  | "all"
  | "info"
  | "warning"
  | "error";

export function filterEvents(
  events: RealtimeEvent[],
  filter: EventFilter
): RealtimeEvent[] {
  if (filter === "all") return events;

  return events.filter(
    (event) => event.type === filter
  );
}
