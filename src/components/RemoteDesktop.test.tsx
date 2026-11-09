
 // @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import RemoteDesktop from "./RemoteDesktop";

describe("RemoteDesktop integration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("shows the disconnected state initially", () => {
    render(<RemoteDesktop />);

    expect(
      screen.getByRole("heading", {
        name: "Disconnected",
        level: 2,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("button", { name: "Connect" })
        .hasAttribute("disabled")
    ).toBe(false);
  });

  it("connects and displays the mock desktop", () => {
    render(<RemoteDesktop />);

    fireEvent.click(
      screen.getByRole("button", { name: "Connect" })
    );

    expect(
      screen.getByRole("heading", {
        name: "Connecting",
        level: 2,
      })
    ).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(
      screen.getByText("Remote Desktop Connected")
    ).toBeTruthy();
  });

  it("disconnects from an active session", () => {
    render(<RemoteDesktop />);

    fireEvent.click(
      screen.getByRole("button", { name: "Connect" })
    );

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Disconnect" })
    );

    expect(
      screen.getByRole("heading", {
        name: "Disconnecting",
        level: 2,
      })
    ).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(
      screen.getByRole("heading", {
        name: "Disconnected",
        level: 2,
      })
    ).toBeTruthy();
  });

  it("shows an error and allows retrying", () => {
    render(<RemoteDesktop />);

    fireEvent.click(
      screen.getByRole("button", { name: "Connect" })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simulate Error",
      })
    );

    expect(
      screen.getByRole("alert").textContent
    ).toContain("Remote desktop connection failed.");

    fireEvent.click(
      screen.getByRole("button", { name: "Connect" })
    );

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(
      screen.getByText("Remote Desktop Connected")
    ).toBeTruthy();
  });

  it("cancels connecting when disconnect is clicked", () => {
    render(<RemoteDesktop />);

    fireEvent.click(
      screen.getByRole("button", { name: "Connect" })
    );

    expect(
      screen.getByRole("heading", {
        name: "Connecting",
        level: 2,
      })
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Disconnect" })
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(
      screen.getByRole("heading", {
        name: "Disconnected",
        level: 2,
      })
    ).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(
      screen.queryByText("Remote Desktop Connected")
    ).toBeNull();
  });
});
