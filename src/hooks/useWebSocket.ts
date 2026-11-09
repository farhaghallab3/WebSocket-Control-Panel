
import { useEffect, useRef, useState } from "react";

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | "error";

export type Message = {
  id: string;
  text: string;
  direction: "sent" | "received";
};

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const [status, setStatus] =
    useState<ConnectionStatus>("disconnected");

  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  const connect = () => {
    if (socketRef.current) return;

    setStatus("connecting");
    setErrorMessage(null);

    let socket: WebSocket;

    try {
      socket = new WebSocket(url);
    } catch {
      setStatus("error");
      setErrorMessage("Invalid WebSocket URL.");
      return;
    }

    socketRef.current = socket;

    // This flag belongs to this specific connection.
    let intentionalClose = false;
    let connectionError = false;

    socket.onopen = () => {
      if (socketRef.current !== socket) return;
      setStatus("connected");
    };

    socket.onmessage = (event) => {
      if (socketRef.current !== socket) return;

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          text: String(event.data),
          direction: "received",
        },
      ]);
    };

    socket.onerror = () => {
      if (socketRef.current !== socket) return;

      connectionError = true;
      setStatus("error");
      setErrorMessage("WebSocket connection error.");
    };

    socket.onclose = () => {
      if (socketRef.current !== socket) return;

      socketRef.current = null;

      if (intentionalClose) {
        setStatus("disconnected");
        setErrorMessage(null);
      } else {
        setStatus("error");
        setErrorMessage(
          connectionError
            ? "Connection failed or was interrupted."
            : "Connection closed unexpectedly."
        );
      }
    };

    // Store the disconnect behavior for this connection.
    disconnectRef.current = () => {
      if (
        socket.readyState === WebSocket.CLOSING ||
        socket.readyState === WebSocket.CLOSED
      ) {
        return;
      }

      intentionalClose = true;
      setStatus("disconnecting");
      socket.close();
    };
  };

  const disconnectRef = useRef<(() => void) | null>(null);

  const disconnect = () => {
    disconnectRef.current?.();
  };

  const sendMessage = (text: string) => {
    const socket = socketRef.current;

    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      !text.trim()
    ) {
      return false;
    }

    try {
      socket.send(text);

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          text,
          direction: "sent",
        },
      ]);

      return true;
    } catch {
      setErrorMessage("Failed to send message.");
      return false;
    }
  };

  useEffect(() => {
    return () => {
      const socket = socketRef.current;

      socketRef.current = null;
      disconnectRef.current = null;

      if (
        socket &&
        socket.readyState !== WebSocket.CLOSING &&
        socket.readyState !== WebSocket.CLOSED
      ) {
        socket.close();
      }
    };
  }, []);

  return {
    status,
    messages,
    errorMessage,
    connect,
    disconnect,
    sendMessage,
  };
}
