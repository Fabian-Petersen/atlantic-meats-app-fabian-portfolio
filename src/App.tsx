import "./index.css";
import Navbar from "@/components/header/Navbar";
import { useAuth } from "./auth/AuthContext";
import { Navigate, Outlet, Routes, Route } from "react-router-dom";

//$ Routes
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import MaintenanceRequestPage from "./pages/MaintenanceRequestPage";
import Assets from "./pages/Assets";
import Sidebar from "./components/dashboardSidebar/Sidebar";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated ? <Sidebar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/maintenance-request"
            element={<MaintenanceRequestPage />}
          />
          <Route path="/asset-register" element={<Assets />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
