// import "./index.css";
import { Routes, Route } from "react-router-dom";

//$ Public Routes
import Login from "./pages/Login";

//$ Protected Routes
import DashboardPage from "./pages/Dashboard";
import MaintenanceRequestPage from "./pages/MaintenanceRequestPage";
import AssetsOverviewPage from "./pages/AssetsOverviewPage";

//$ Page Layouts
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicLayout } from "./routes/PublicLayout";
import { AppLayout } from "./routes/AppLayout";
import MaintenanceRequestOverviewPage from "./pages/MaintenanceRequestOverviewPage";
import MaintRequestSingleItemPage from "./pages/MaintRequestSingleItemPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
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
              element={<MaintenanceRequestOverviewPage />}
            />
            <Route
              path="/maintenance-request/:id"
              element={<MaintRequestSingleItemPage />}
            />
            <Route path="/asset" element={<AssetsOverviewPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
