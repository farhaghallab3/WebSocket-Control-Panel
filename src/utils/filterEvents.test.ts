
import { describe, expect, it } from "vitest";
import { filterEvents } from "./filterEvents";
import type { RealtimeEvent } from "../types/realtimeEvent";

const events: RealtimeEvent[] = [
  {
    id: "1",
    type: "info",
    message: "System started",
    timestamp: "2026-11-09T12:00:00.000Z",
  },
  {
    id: "2",
    type: "warning",
    message: "High memory usage",
    timestamp: "2026-11-09T12:00:01.000Z",
  },
  {
    id: "3",
    type: "error",
    message: "Connection failed",
    timestamp: "2026-11-09T12:00:02.000Z",
  },
];

describe("filterEvents", () => {
  it("returns all events", () => {
    expect(filterEvents(events, "all")).toHaveLength(3);
  });

  it("filters info events", () => {
    expect(filterEvents(events, "info")).toHaveLength(1);
  });

  it("filters warning events", () => {
    expect(filterEvents(events, "warning")[0].id).toBe("2");
  });

  it("filters error events", () => {
    expect(filterEvents(events, "error")[0].id).toBe("3");
  });

  it("returns empty array when no events match", () => {
    expect(filterEvents([], "error")).toEqual([]);
  });

  it("does not mutate original events", () => {
    const original = [...events];

    filterEvents(events, "warning");

    expect(events).toEqual(original);
  });
});
