import { useEffect, useState } from "react";
import { getUserGroups } from "@/auth/getUserGroups";

export type UserRole = "admin" | "manager";

export function useUserRole() {
  const [role, setRole] = useState<UserRole>("manager");

  useEffect(() => {
    const resolveRole = async () => {
      const groups = await getUserGroups(); // e.g. string[] like ["admin"]
      setRole(groups?.includes("admin") ? "admin" : "manager");
    };
    resolveRole();
  }, []);

  return role;
}
