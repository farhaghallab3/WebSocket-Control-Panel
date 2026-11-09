
import { useEffect, useRef, useState } from "react";
import {
  type RemoteSessionStatus,
} from "../types/remoteSession";

const CONNECTION_DELAY = 1200;
const DISCONNECTION_DELAY = 500;

export function useRemoteSession() {
  const [status, setStatus] =
    useState<RemoteSessionStatus>("disconnected");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const statusRef = useRef<RemoteSessionStatus>("disconnected");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const updateStatus = (nextStatus: RemoteSessionStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  };

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const connect = () => {
    if (
      statusRef.current !== "disconnected" &&
      statusRef.current !== "error"
    ) {
      return;
    }

    clearTimer();
    setErrorMessage(null);
    updateStatus("connecting");

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      updateStatus("connected");
    }, CONNECTION_DELAY);
  };

  const disconnect = () => {
    if (
      statusRef.current !== "connected" &&
      statusRef.current !== "connecting"
    ) {
      return;
    }

    clearTimer();
    updateStatus("disconnecting");

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      updateStatus("disconnected");
    }, DISCONNECTION_DELAY);
  };

  const simulateError = () => {
    if (
      statusRef.current !== "connecting" &&
      statusRef.current !== "connected"
    ) {
      return;
    }

    clearTimer();
    setErrorMessage("Remote desktop connection failed.");
    updateStatus("error");
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return {
    status,
    errorMessage,
    connect,
    disconnect,
    simulateError,
  };
}
