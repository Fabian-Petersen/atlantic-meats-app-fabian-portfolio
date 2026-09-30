// src/auth/AuthContext.tsx
import { useCallback, useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";
import type { UserGroup } from "@/schemas/usersSchema";

export type AuthContextType = {
  isAuthenticated: boolean;
  userGroups: UserGroup[];
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

type AuthState = {
  isAuthenticated: boolean;
  userGroups: UserGroup[];
};

const validGroups: UserGroup[] = [
  "admin",
  "manager",
  "user",
  "maintenance",
  "contractor",
];

const resolveAuthState = async (): Promise<AuthState> => {
  try {
    const session = await fetchAuthSession();
    const groupClaim = session.tokens?.accessToken?.payload["cognito:groups"];
    const userGroups = Array.isArray(groupClaim)
      ? groupClaim.filter(
          (group): group is UserGroup =>
            typeof group === "string" &&
            validGroups.includes(group as UserGroup),
        )
      : [];

    return {
      isAuthenticated: !!session.tokens?.idToken,
      userGroups,
    };
  } catch (error) {
    console.error("❌ refreshAuth error:", error);
    return { isAuthenticated: false, userGroups: [] };
  }
};

let initialAuthStatePromise: Promise<AuthState> | null = null;

const getInitialAuthState = () => {
  initialAuthStatePromise ??= resolveAuthState();
  return initialAuthStatePromise;
};

//$ change back to false for production
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    const authState = await resolveAuthState();
    initialAuthStatePromise = Promise.resolve(authState);
    setIsAuthenticated(authState.isAuthenticated);
    setUserGroups(authState.userGroups);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setIsAuthenticated(false);
    setUserGroups([]);
    initialAuthStatePromise = null;
  }, []);

  useEffect(() => {
    let isActive = true;

    void getInitialAuthState().then((authState) => {
      if (!isActive) return;
      setIsAuthenticated(authState.isAuthenticated);
      setUserGroups(authState.userGroups);
      setLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userGroups, loading, refreshAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
