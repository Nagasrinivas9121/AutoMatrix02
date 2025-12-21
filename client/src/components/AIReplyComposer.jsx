import React, { useState } from "react";
import api from "../api/api";
import useToast from "../hooks/useToast";
import { useUser } from "../context/UserContext";

export default function AIReplyComposer({ ticketId, onSent }) {
  const [suggestion, setSuggestion] = useState("");
  const [manual, setManual] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const { user } = useUser();
  const toast = useToast();

  // ======================================================
  // PLAN & TRIAL LOGIC (SAFE)
  // ======================================================
  const plan = user?.org?.plan || "free";

  const trialEndsAt = user?.org?.trialEndsAt
    ? new Date(user.org.trialEndsAt)
    : null;

  const trialExpired =
    plan === "trial" &&
    trialEndsAt &&
    trialEndsAt.getTime() < Date.now();

  const isFree = plan === "free";

  // AI limits (trial only)
  const aiUsed = user?.org?.aiReplyUsed || 0;
  const AI_LIMIT = 30;

  const aiLimitReached = plan === "trial" && aiUsed >= AI_LIMIT;

  const aiBlocked = isFree || trialExpired || aiLimitReached;

  // ======================================================
  // BLOCKED UI
  // ======================================================
  if (aiBlocked) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
        <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">
          🚫 AI Reply Unavailable
        </h3>

        {isFree && (
          <p className="text-sm text-red-600 dark:text-red-300 mb-3">
            AI replies are available only on paid plans.
          </p>
        )}

        {trialExpired && (
          <p className="text-sm text-red-600 dark:text-red-300 mb-3">
            Your trial has ended. Upgrade to continue using AI automation.
          </p>
        )}

        {aiLimitReached && (
          <p className="text-sm text-red-600 dark:text-red-300 mb-3">
            You have used <b>{aiUsed}/{AI_LIMIT}</b> AI replies in trial.
            Upgrade to unlock unlimited AI responses.
          </p>
        )}

        <a
          href="/pricing"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Upgrade Plan
        </a>
      </div>
    );
  }

  // ======================================================
  // GENERATE AI REPLY
  // ======================================================
  const generateAI = async () => {
    if (loading || suggestion) return;

    setLoading(true);
    try {
      const res = await api.post("/ai/generate-reply", { ticketId });
      setSuggestion(res.data.reply);
      toast.success("AI reply generated");
    } catch {
      toast.error("AI failed to generate reply");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SEND REPLY
  // ======================================================
  const sendReply = async () => {
    const body = manual.trim() || suggestion.trim();
    if (!body) return toast.error("Reply cannot be empty");

    setSending(true);
    try {
      await api.post("/messages/send", { ticketId, body });

      toast.success("Reply sent!");
      setManual("");
      setSuggestion("");

      if (onSent) onSent(); // refresh messages safely
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={generateAI}
          disabled={loading || !!suggestion}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                     hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "✨ Generate AI Reply"}
        </button>

        <button
          onClick={sendReply}
          disabled={(!manual && !suggestion) || sending}
          className="px-4 py-2 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Reply"}
        </button>
      </div>

      {/* AI SUGGESTION */}
      {suggestion && (
        <div className="p-4 bg-white dark:bg-slate-800 border rounded-xl shadow">
          <div className="text-xs text-slate-500 mb-1">AI Suggestion</div>
          <p className="whitespace-pre-wrap">{suggestion}</p>

          <button
            className="mt-2 text-sm text-blue-600 underline"
            onClick={() => setSuggestion("")}
          >
            Clear AI reply
          </button>
        </div>
      )}

      {/* MANUAL INPUT */}
      <textarea
        className="w-full p-4 border rounded-xl dark:bg-slate-800 dark:border-slate-700"
        rows={4}
        placeholder="Write a custom reply…"
        value={manual}
        onChange={(e) => {
          setManual(e.target.value);
          if (e.target.value.trim()) setSuggestion("");
        }}
      />
    </div>
  );
}