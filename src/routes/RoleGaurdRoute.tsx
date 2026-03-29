// routes/RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserGroups } from "@/auth/getUserGroups";
import type { UserGroup } from "@/schemas/usersSchema";

type Props = {
  allowedGroups: UserGroup[];
};

export default function RoleGaurdRoute({ allowedGroups }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const groups = await getUserGroups();
        const allowed = allowedGroups.some((group) => groups.includes(group));
        setIsAllowed(allowed);
      } catch {
        setIsAllowed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [allowedGroups]);

  if (isLoading) return <div>Loading...</div>;

  return isAllowed ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
