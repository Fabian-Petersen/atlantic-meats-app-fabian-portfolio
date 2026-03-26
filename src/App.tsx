// import "./index.css";
import { Routes, Route } from "react-router-dom";

//$ Public Routes
import Login from "./pages/Login";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

//$ Protected Routes
import DashboardPage from "./pages/Dashboard";
import JobRequestPage from "./pages/JobRequestPage";
import AssetsOverviewPage from "./pages/AssetsOverviewPage";

import { AppLayout } from "./routes/AppLayout";

// $ Gaurd Routes
import { ProtectedRoute } from "./routes/ProtectedRoute";
import RoleGaurdRoute from "./routes/RoleGaurdRoute";

//$ Page Layouts
// import JobItemPage from "./pages/JobApprovedItemPage";
import JobActionItemPage from "./pages/JobActionPage";

// $ Assets Pages
import CreateAssetPage from "./pages/CreateAssetPage";
import ActionsListPage from "./pages/ActionsListPage";
import AssetsSingleItemPage from "./pages/AssetsSingleItemPage";

// $ User Management Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserProfilePage from "./pages/UserProfilePage";

// $ Job Management Pages for single items
import JobPendingItemPage from "./pages/JobPendingItemPage";
import JobApprovedItemPage from "./pages/JobApprovedItemPage";

// $ Pages display the list of items in a table
import JobsPendingListPage from "./pages/JobsPendingListPage";
import JobsApprovedListPage from "./pages/JobsApprovedListPage";
import { PageLoadingSpinner } from "./components/features/PageLoadingSpinner";
import UsersListPage from "./pages/UsersListPage";
import { useAuth } from "./auth/useAuth";

function App() {
  const { loading } = useAuth();

  // Don't render routes (and trigger API calls) until Amplify has rehydrated
  if (loading) return <PageLoadingSpinner />;

  return (
    <Routes>
      {/* Login Route Only: Authenticated users must logout to direct to logout */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected: Authenticated Users */}
      <Route element={<ProtectedRoute />}>
        {/* // % All company employee Routes */}
        <Route element={<AppLayout />}>
          <Route
            element={
              <RoleGaurdRoute
                allowedGroups={["admin", "manager", "user", "technician"]}
              />
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/maintenance-request" element={<JobRequestPage />} />
            <Route
              path="/jobs-list-approved/:id"
              element={<JobApprovedItemPage />}
            />
            <Route
              path="/jobs-list-approved"
              element={<JobsApprovedListPage />}
            />
            <Route
              path="/maintenance-action/:id"
              element={<JobActionItemPage />}
            />
          </Route>
          {/* // % Admin only Routes */}
          <Route element={<RoleGaurdRoute allowedGroups={["admin"]} />}>
            <Route
              path="/jobs-list-pending"
              element={<JobsPendingListPage />}
            />
            <Route path="/assets-list" element={<AssetsOverviewPage />} />
            <Route path="/asset/:id" element={<AssetsSingleItemPage />} />
            <Route
              path="/jobs-list-pending/:id"
              element={<JobPendingItemPage />}
            />
            <Route path="/asset" element={<CreateAssetPage />} />
            <Route path="/admin/users" element={<UsersListPage />} />
          </Route>
          {/* // $ ======================= Maintenance Routes ======================= */}
          {/* //% admin, technician, contractor Routes */}
          <Route
            element={
              <RoleGaurdRoute
                allowedGroups={["contractor", "technician", "admin"]}
              />
            }
          >
            <Route
              path="/maintenance-action/:id"
              element={<JobActionItemPage />}
            />
            <Route
              path="/maintenance-actions-list"
              element={<ActionsListPage />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
