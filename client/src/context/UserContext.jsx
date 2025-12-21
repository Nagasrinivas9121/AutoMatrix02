import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/api";

const UserContext = createContext(null);

// --------------------------------------------------
// PROVIDER
// --------------------------------------------------
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --------------------------------------------------
  // LOAD CURRENT USER (SAFE + STABLE)
  // --------------------------------------------------
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    setLoadingUser(true);

    // No token → logged out state
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");

      /**
       * Supported backend responses:
       * 1) { ...userFields, org: {...} }
       * 2) { user: {...}, org: {...} }
       */
      const data = res.data;
      setUser(data.user || data);

    } catch (err) {
      console.warn(
        "User load failed:",
        err?.response?.data || err.message
      );

      // Token invalid / expired → hard logout
      localStorage.removeItem("token");
      setUser(null);

    } finally {
      setLoadingUser(false);
    }
  }, []);

  // --------------------------------------------------
  // INITIAL LOAD (ON APP START)
  // --------------------------------------------------
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------
  const value = {
    user,
    setUser,        // used after login
    loadingUser,
    reloadUser: loadUser, // used after profile update / refresh
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// --------------------------------------------------
// HOOK
// --------------------------------------------------
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside <UserProvider>");
  }
  return ctx;
};