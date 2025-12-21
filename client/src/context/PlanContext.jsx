import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/api";

const PlanContext = createContext(null);

// ------------------------------------
// PROVIDER
// ------------------------------------
export const PlanProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // LOAD CURRENT USER + ORG PLAN
  // ------------------------------------
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me");

      /**
       * Expected backend shapes supported:
       * 1) { user: {...}, org: {...} }
       * 2) { ...userFields, org: {...} }
       */
      const data = res.data;

      setUser(data.user || data);
      setOrg(data.org || data.user?.org || null);
    } catch (err) {
      console.error("Failed to load plan context:", err);
      setUser(null);
      setOrg(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------
  // INITIAL LOAD
  // ------------------------------------
  useEffect(() => {
    load();
  }, [load]);

  // ------------------------------------
  // EXPOSED API
  // ------------------------------------
  const value = {
    user,
    org,
    loading,
    refresh: load,     // re-fetch after upgrade / payment
    setOrg,            // optimistic plan updates
    setUser,
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
};

// ------------------------------------
// HOOK
// ------------------------------------
export const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) {
    throw new Error("usePlan must be used inside <PlanProvider>");
  }
  return ctx;
};