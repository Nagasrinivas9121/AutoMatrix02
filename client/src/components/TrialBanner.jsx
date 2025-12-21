import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function TrialBanner() {
  const { user } = useUser();

  if (!user?.org) return null;

  const { plan, trialEndsAt } = user.org;

  if (plan !== "trial" || !trialEndsAt) return null;

  const end = new Date(trialEndsAt);
  if (isNaN(end.getTime())) return null;

  const today = new Date();
  const diffDays = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isExpired = diffDays <= 0;

  return (
    <div
      className={`
        p-3 text-center text-sm font-medium border-b
        ${
          isExpired
            ? "bg-red-100 text-red-800 border-red-300"
            : "bg-yellow-100 text-yellow-900 border-yellow-300"
        }
      `}
    >
      {isExpired ? (
        <>
          ❌ Your free trial has ended.
          <Link
            to="/pricing"
            className="underline ml-2 font-semibold text-red-700"
          >
            Upgrade to continue
          </Link>
        </>
      ) : (
        <>
          ⏳ Your free trial ends in{" "}
          <b>{diffDays} day{diffDays > 1 ? "s" : ""}</b>.
          <Link
            to="/pricing"
            className="underline ml-2 font-semibold text-yellow-800"
          >
            Upgrade now
          </Link>
        </>
      )}
    </div>
  );
}