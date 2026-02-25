// import "./index.css";
import { Routes, Route } from "react-router-dom";

//$ Public Routes
import Login from "./pages/Login";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

//$ Protected Routes
import DashboardPage from "./pages/Dashboard";
import JobRequestPage from "./pages/JobRequestPage";
import AssetsOverviewPage from "./pages/AssetsOverviewPage";

//$ Page Layouts
import { ProtectedRoute } from "./routes/ProtectedRoute";
// import { PublicLayout } from "./routes/PublicLayout";
import { AppLayout } from "./routes/AppLayout";
import JobsListPage from "./pages/JobsListPage";
import JobItemPage from "./pages/JobItemPage";
import AssetsSingleItemPage from "./pages/AssetsSingleItemPage";
import UserProfilePage from "./pages/UserProfilePage";
import CreateAssetPage from "./pages/CreateAssetPage";
import JobActionItemPage from "./pages/JobActionPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Routes>
      {/* <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
        </Route> */}
      {/* Login Route Only: Authenticated users must logout to direct to logout */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected: Authenticated Users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* // $ ======================= Maintenance Routes ======================= */}{" "}
          <Route path="/maintenance-request" element={<JobRequestPage />} />
          <Route path="/maintenance-requests-list" element={<JobsListPage />} />
          <Route path="/maintenance-request/:id" element={<JobItemPage />} />
          <Route
            path="/maintenance-action/:id"
            element={<JobActionItemPage />}
          />
          {/* // $ ======================= Asset Routes ======================= */}
          {/*GET: All assets returned*/}
          <Route path="/assets-list" element={<AssetsOverviewPage />} />
          {/*POST: Create an asset*/}
          <Route path="/asset" element={<CreateAssetPage />} />{" "}
          {/*PUT, DELETE, GET: a single asset*/}
          <Route path="/asset/:id" element={<AssetsSingleItemPage />} />{" "}
          {/* // $ ======================= Settings Routes ======================= */}
          <Route path="/user-profile" element={<UserProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
