// src/utils/upgradeModal.js

/**
 * Global Upgrade Modal Controller
 * Safe for React StrictMode, avoids memory leaks & duplicate listeners
 */

let listeners = new Set();

/**
 * Open the upgrade modal
 */
export const openUpgradeModal = () => {
  listeners.forEach((cb) => cb(true));
};

/**
 * Close the upgrade modal
 */
export const closeUpgradeModal = () => {
  listeners.forEach((cb) => cb(false));
};

/**
 * Subscribe to upgrade modal state
 * @param {(open: boolean) => void} cb
 * @returns {() => void} unsubscribe function
 */
export const subscribeUpgrade = (cb) => {
  if (typeof cb !== "function") return () => {};

  listeners.add(cb);

  // Cleanup to prevent memory leaks
  return () => {
    listeners.delete(cb);
  };
};