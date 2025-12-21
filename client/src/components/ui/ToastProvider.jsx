import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import Toast from "./Toast";

/**
 * ToastProvider
 * --------------
 * Provides:
 *   toast.show({ type, title, message, duration })
 *   toast.success / error / info / warn helpers
 *
 * Usage:
 *   Wrap <ToastProvider> around your app (main.jsx / index.jsx)
 */

const ToastContext = createContext(null);

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used inside <ToastProvider>");
  }
  return ctx;
};

export default function ToastProvider({
  children,
  position = "top-right",
}) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const idCounter = useRef(1);

  // ---------------------------------------------------
  // ADD TOAST
  // ---------------------------------------------------
  const add = useCallback(
    ({ type = "info", title = "", message = "", duration = 4000 }) => {
      const id = idCounter.current++;

      setToasts((prev) => [...prev, { id, type, title, message }]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
          timers.current.delete(id);
        }, duration);

        timers.current.set(id, timer);
      }

      return id;
    },
    []
  );

  // ---------------------------------------------------
  // REMOVE TOAST (manual close)
  // ---------------------------------------------------
  const remove = useCallback((id) => {
    if (timers.current.has(id)) {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
    }

    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------
  const toast = {
    show: add,
    success: (opts) => add({ ...opts, type: "success" }),
    error: (opts) => add({ ...opts, type: "error" }),
    info: (opts) => add({ ...opts, type: "info" }),
    warn: (opts) => add({ ...opts, type: "warn" }),
    remove,
  };

  // ---------------------------------------------------
  // POSITION CLASSES
  // ---------------------------------------------------
  const positionClass = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  }[position];

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="polite"
        className={`
          fixed z-50 p-4 pointer-events-none
          ${positionClass}
        `}
      >
        <div className="flex flex-col gap-3 pointer-events-auto">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={remove} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}