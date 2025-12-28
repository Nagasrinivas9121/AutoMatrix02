import { useCallback } from "react";
import { useToastContext } from "../components/ui/ToastProvider";

/**
 * useToast
 * Thin wrapper over ToastContext with ergonomic helpers.
 *
 * Usage:
 *   toast.success("Saved");
 *   toast.error("Failed", "Network error");
 *   toast.info({ title: "Heads up", message: "Processing…" });
 */
export default function useToast() {
  const toast = useToastContext();

  // Normalize inputs into { title?, message? }
  const format = (titleOrMsg, msg) => {
    if (typeof titleOrMsg === "string" && typeof msg === "string") {
      return { title: titleOrMsg, message: msg };
    }
    if (typeof titleOrMsg === "string") {
      return { message: titleOrMsg };
    }
    return titleOrMsg || {};
  };

  const success = useCallback(
    (titleOrMsg, msg) => toast?.success(format(titleOrMsg, msg)),
    [toast]
  );

  const error = useCallback(
    (titleOrMsg, msg) => toast?.error(format(titleOrMsg, msg)),
    [toast]
  );

  const info = useCallback(
    (titleOrMsg, msg) => toast?.info(format(titleOrMsg, msg)),
    [toast]
  );

  const warn = useCallback(
    (titleOrMsg, msg) => toast?.warn(format(titleOrMsg, msg)),
    [toast]
  );

  return {
    success,
    error,
    info,
    warn,
    raw: toast, // escape hatch for advanced usage (show/remove)
  };
}