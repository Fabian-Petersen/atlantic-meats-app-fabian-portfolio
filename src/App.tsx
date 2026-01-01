// import "./index.css";
import { Routes, Route } from "react-router-dom";

//$ Public Routes
import Login from "./pages/Login";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

//$ Protected Routes
import DashboardPage from "./pages/Dashboard";
import MaintenanceRequestPage from "./pages/MaintenanceRequestPage";
import AssetsOverviewPage from "./pages/AssetsOverviewPage";

//$ Page Layouts
import { ProtectedRoute } from "./routes/ProtectedRoute";
// import { PublicLayout } from "./routes/PublicLayout";
import { AppLayout } from "./routes/AppLayout";
import MaintenanceRequestOverviewPage from "./pages/MaintenanceRequestOverviewPage";
import MaintRequestSingleItemPage from "./pages/MaintRequestSingleItemPage";
import AssetsSingleItemPage from "./pages/AssetsSingleItemPage";

function App() {
  return (
    <>
      <Routes>
        {/* <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
        </Route> */}
        {/* Login Route Only: Authenticated users must logout to direct to logout */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* Protected: Authenticated Users */}
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
            <Route path="/asset/:id" element={<AssetsSingleItemPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
