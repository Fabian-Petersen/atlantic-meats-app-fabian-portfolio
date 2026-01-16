import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "@/components/header/Navbar";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

export const PublicOnlyRoute = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  console.log("isAuthenticated:", isAuthenticated);

  if (isAuthLoading) return <PageLoadingSpinner />; // or spinner

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
