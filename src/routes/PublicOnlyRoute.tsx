import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "@/components/header/Navbar";

export const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};
