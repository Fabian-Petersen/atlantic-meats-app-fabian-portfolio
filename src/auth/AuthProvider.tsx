// src/auth/AuthContext.tsx
import { useCallback, useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const hasAuthenticatedSession = async () => {
  try {
    const session = await fetchAuthSession();
    return !!session.tokens?.idToken;
  } catch (error) {
    console.error("❌ refreshAuth error:", error);
    return false;
  }
};

//$ change back to false for production
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    const authenticated = await hasAuthenticatedSession();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    let isActive = true;

    void hasAuthenticatedSession().then((authenticated) => {
      if (!isActive) return;
      setIsAuthenticated(authenticated);
      setLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, refreshAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
