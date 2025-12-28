import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * useSocket
 * - Establishes a single Socket.IO connection
 * - Authenticated via JWT (if present)
 * - Safe cleanup on unmount
 * - Avoids stale callback issues
 *
 * @param {(data: any) => void} onNotification
 * @returns {Socket | null}
 */
export default function useSocket(onNotification) {
  const socketRef = useRef(null);
  const callbackRef = useRef(onNotification);

  // Keep latest callback without re-connecting socket
  useEffect(() => {
    callbackRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      autoConnect: true,
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Notifications
    socket.on("notification", (data) => {
      callbackRef.current?.(data);
    });

    // Optional: diagnostics (safe to remove in prod)
    socket.on("connect", () => {
      console.debug("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.debug("🔌 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.warn("🔌 Socket error:", err.message);
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef.current;
}