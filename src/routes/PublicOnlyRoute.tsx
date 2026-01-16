import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "@/components/header/Navbar";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

export const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoadingSpinner />; // or spinner

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
