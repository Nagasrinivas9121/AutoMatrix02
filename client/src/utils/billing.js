/**
 * Returns true if the user's trial has expired.
 *
 * Rules:
 * - Non-trial plans are never expired
 * - Missing / invalid trialEndsAt is treated as NOT expired (safe default)
 */
export const isTrialExpired = (user) => {
  const plan = user?.org?.plan;
  const trialEndsAt = user?.org?.trialEndsAt;

  if (plan !== "trial") return false;
  if (!trialEndsAt) return false;

  const end = new Date(trialEndsAt);
  if (Number.isNaN(end.getTime())) return false;

  return end.getTime() < Date.now();
};