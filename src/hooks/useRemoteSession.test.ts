
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
import { useRemoteSession } from "./useRemoteSession";

describe("useRemoteSession", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  // TEST 1 — Initial state
  it("starts disconnected", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    expect(result.current.status).toBe("disconnected");
    expect(result.current.errorMessage).toBeNull();

    unmount();
  });

  // TEST 2 — Successful connection
  it("connects after the simulated delay", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    act(() => {
      result.current.connect();
    });

    expect(result.current.status).toBe("connecting");

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.status).toBe("connected");

    unmount();
  });

  // TEST 3 — Manual disconnect
  it("disconnects after the simulated delay", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    act(() => {
      result.current.connect();
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.status).toBe("connected");

    act(() => {
      result.current.disconnect();
    });

    expect(result.current.status).toBe("disconnecting");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.status).toBe("disconnected");

    unmount();
  });

  // TEST 4 — Disconnect while connecting
  it("cancels connection when disconnecting early", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    act(() => {
      result.current.connect();
    });

    expect(result.current.status).toBe("connecting");

    act(() => {
      result.current.disconnect();
    });

    expect(result.current.status).toBe("disconnecting");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.status).toBe("disconnected");

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.status).toBe("disconnected");

    unmount();
  });

  // TEST 5 — Simulated failure
  it("handles connection errors", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    act(() => {
      result.current.connect();
      result.current.simulateError();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.errorMessage).toBe(
      "Remote desktop connection failed."
    );

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.status).toBe("error");

    unmount();
  });

  // TEST 6 — Retry after failure
  it("allows reconnecting after an error", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    act(() => {
      result.current.connect();
      result.current.simulateError();
    });

    expect(result.current.status).toBe("error");

    act(() => {
      result.current.connect();
    });

    expect(result.current.status).toBe("connecting");
    expect(result.current.errorMessage).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.status).toBe("connected");

    unmount();
  });

  // TEST 7 — Prevent duplicate connect
  it("prevents duplicate connection attempts", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    act(() => {
      result.current.connect();
      result.current.connect();
    });

    expect(result.current.status).toBe("connecting");
    expect(vi.getTimerCount()).toBe(1);

    unmount();
  });

  // TEST 8 — Cleanup
  it("clears timers when unmounted", () => {
    const { result, unmount } = renderHook(() =>
      useRemoteSession()
    );

    act(() => {
      result.current.connect();
    });

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
