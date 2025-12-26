import "./index.css";
// import Navbar from "@/components/header/Navbar";
// import { useAuth } from "./auth/AuthContext";
import { Routes, Route } from "react-router-dom";

//$ Routes
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import MaintenanceRequestPage from "./pages/MaintenanceRequestPage";
import Assets from "./pages/Assets";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicLayout } from "./routes/PublicLayout";
import { AppLayout } from "./routes/AppLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/maintenance-request"
              element={<MaintenanceRequestPage />}
            />
            <Route
              path="/maintenance-list"
              element={<MaintenanceRequestPage />}
            />
            <Route path="/asset-register" element={<Assets />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
