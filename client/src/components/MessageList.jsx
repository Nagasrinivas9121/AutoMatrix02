import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";

export default function MessageList({ ticketId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  // -----------------------------------------
  // FETCH MESSAGES
  // -----------------------------------------
  useEffect(() => {
    if (!ticketId) return;

    const controller = new AbortController();
    setLoading(true);
    setError("");

    api
      .get(`/api/tickets/${ticketId}/messages`, {
        signal: controller.signal,
      })
      .then((res) => setMessages(res.data || []))
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error("Failed to load messages", err);
          setError("Unable to load conversation.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [ticketId]);

  // -----------------------------------------
  // AUTO SCROLL (after render)
  // -----------------------------------------
  useEffect(() => {
    const t = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    return () => clearTimeout(t);
  }, [messages]);

  // -----------------------------------------
  // STATES
  // -----------------------------------------
  if (loading) {
    return (
      <div className="py-8 text-center text-slate-400 animate-pulse">
        Loading messages…
      </div>
    );
  }

  if (error) {
    return (
      <div className="
        text-center text-red-600 dark:text-red-400 
        py-6 bg-red-50 dark:bg-red-900/30 
        rounded-xl border border-red-200 dark:border-red-800
      ">
        {error}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="
        text-center text-gray-500 dark:text-slate-400 
        py-8 bg-white dark:bg-slate-800 
        rounded-xl border border-slate-200 dark:border-slate-700 
        shadow-sm
      ">
        No messages yet.
      </div>
    );
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------
  return (
    <div
      className="
        space-y-4 max-h-[60vh] overflow-auto p-4 
        bg-slate-50 dark:bg-slate-900 
        rounded-xl border border-slate-200 dark:border-slate-700 
        shadow-sm animate-fadeIn
      "
    >
      {messages.map((m) => {
        const isIncoming = m.direction === "IN";
        const created =
          m.createdAt || m.created_at || m.created || Date.now();

        return (
          <div
            key={m.id}
            className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`
                px-4 py-3 rounded-2xl max-w-[75%] shadow-sm border
                ${
                  isIncoming
                    ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    : "bg-blue-600 dark:bg-blue-500 text-white border-blue-500 dark:border-blue-400"
                }
              `}
            >
              {/* Sender */}
              <div
                className={`
                  text-xs font-semibold mb-1
                  ${
                    isIncoming
                      ? "text-slate-600 dark:text-slate-300"
                      : "text-blue-100"
                  }
                `}
              >
                {m.sender || "System"}
              </div>

              {/* Message */}
              <div className="leading-relaxed break-words">
                {m.body}
              </div>

              {/* AI Tag */}
              {m.ai_generated && (
                <div
                  className={`
                    text-xs mt-2 font-semibold
                    ${
                      isIncoming
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-purple-200"
                    }
                  `}
                >
                  ✨ AI-generated reply
                </div>
              )}

              {/* Time */}
              <div
                className={`
                  text-[10px] mt-2
                  ${
                    isIncoming
                      ? "text-slate-400 dark:text-slate-500"
                      : "text-blue-200"
                  }
                `}
              >
                {new Date(created).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}