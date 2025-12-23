// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const session = await fetchAuthSession();
      setIsAuthenticated(!!session.tokens?.idToken);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    refreshAuth(); // runs on app load / refresh
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, refreshAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
