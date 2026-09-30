// routes/RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import type { UserGroup } from "@/schemas/usersSchema";
import { useAuth } from "@/auth/useAuth";

type Props = {
  allowedGroups: UserGroup[];
};

export default function RoleGaurdRoute({ allowedGroups }: Props) {
  const { userGroups } = useAuth();
  const isAllowed = allowedGroups.some((group) => userGroups.includes(group));

  return isAllowed ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
