
import { describe, expect, it } from "vitest";
import { parseEvent } from "./realtimeEvent";

describe("parseEvent", () => {
  const validEvent = {
    id: "evt-001",
    timestamp: "2026-11-09T18:06:03.475Z",
    type: "info",
    message: "System is running normally",
  };

  // TEST 1 — Valid event
  it("parses a valid JSON event", () => {
    const result = parseEvent(JSON.stringify(validEvent));

    expect(result).toEqual(validEvent);
  });

  // TEST 2 — Malformed JSON
  it("rejects malformed JSON", () => {
    const result = parseEvent(
      '{"type":"warning","message":'
    );

    expect(result).toBeNull();
  });

  // TEST 3 — Missing fields
  it("rejects events with missing required fields", () => {
    const invalidEvent = {
      type: "warning",
      message: "High memory usage detected",
    };

    expect(
      parseEvent(JSON.stringify(invalidEvent))
    ).toBeNull();
  });

  // TEST 4 — Unsupported event type
  it("rejects unsupported event types", () => {
    const invalidEvent = {
      ...validEvent,
      type: "critical",
    };

    expect(
      parseEvent(JSON.stringify(invalidEvent))
    ).toBeNull();
  });

  // TEST 5 — Invalid timestamp
  it("rejects invalid timestamps", () => {
    const invalidEvent = {
      ...validEvent,
      timestamp: "not-a-date",
    };

    expect(
      parseEvent(JSON.stringify(invalidEvent))
    ).toBeNull();
  });

  // TEST 6 — Wrong field types
  it("rejects events with incorrect field types", () => {
    const invalidEvent = {
      ...validEvent,
      id: 123,
    };

    expect(
      parseEvent(JSON.stringify(invalidEvent))
    ).toBeNull();
  });

  // TEST 7 — Empty message
  it("rejects empty or whitespace-only messages", () => {
    const invalidEvent = {
      ...validEvent,
      message: "   ",
    };

    expect(
      parseEvent(JSON.stringify(invalidEvent))
    ).toBeNull();
  });

  // TEST 8 — Null and arrays
  it("rejects null and array values", () => {
    expect(parseEvent("null")).toBeNull();
    expect(parseEvent("[]")).toBeNull();
  });

  // TEST 9 — All supported event types
  it.each(["info", "warning", "error"])(
    "accepts the %s event type",
    (type) => {
      const event = {
        ...validEvent,
        type,
      };

      expect(
        parseEvent(JSON.stringify(event))
      ).toEqual(event);
    }
  );

  // TEST 10 — Empty ID
  it("rejects empty event IDs", () => {
    const invalidEvent = {
      ...validEvent,
      id: "   ",
    };

    expect(
      parseEvent(JSON.stringify(invalidEvent))
    ).toBeNull();
  });
});
