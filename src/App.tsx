// import "./index.css";
import { Routes, Route } from "react-router-dom";

//$ Public Routes
import Login from "./pages/Login";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

//$ Protected Routes
import DashboardPage from "./pages/Dashboard";
import CreateJobPage from "./pages/CreateJobPage";
import AssetsOverviewPage from "./pages/AssetsOverviewPage";

import { AppLayout } from "./routes/AppLayout";

// $ Gaurd Routes
import { ProtectedRoute } from "./routes/ProtectedRoute";
import RoleGaurdRoute from "./routes/RoleGaurdRoute";

//$ Page Layouts
// import JobItemPage from "./pages/JobApprovedItemPage";
// import JobActionItemPage from "./pages/JobActionPage";
import JobActionPage from "./pages/JobActionPage";

// $ Assets Pages
import CreateAssetPage from "./pages/CreateAssetPage";
import AssetsSingleItemPage from "./pages/AssetsSingleItemPage";

// $ User Management Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserProfilePage from "./pages/UserProfilePage";
import StoreProfilePage from "./pages/StoreProfilePage";

// $ Job Management Pages for single items
import JobPendingItemPage from "./pages/JobPendingItemPage";
import JobInProgressItemPage from "./pages/JobInProgressItemPage";
import JobCompleteItemPage from "./pages/JobCompleteItemPage";
import JobsCompletedListPage from "./pages/JobsCompletedListPage";

// $ Pages display the list of items in a table
import JobsPendingListPage from "./pages/JobsPendingListPage";
import JobsInProgressListPage from "./pages/JobsInProgressListPage";
import { PageLoadingSpinner } from "./components/features/PageLoadingSpinner";
import UsersListPage from "./pages/UsersListPage";
import { useAuth } from "./auth/useAuth";
import CreateUserPage from "./pages/CreateUserPage";

// $ Stock Pages
import CreateStockPage from "./pages/stocks/CreateStockPage";
import StocksListPage from "./pages/stocks/StocksListPage";
import AssetHistoryPage from "./pages/AssetHistoryPage";
import AssetVerification from "./pages/AssetVerification";

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
            {/* // $ Route will show the current signed in user profile page */}
            <Route path="/users/profile" element={<UserProfilePage />} />
            <Route path="/jobs/create-job" element={<CreateJobPage />} />
            <Route
              path="/jobs/:id/in-progress"
              element={<JobInProgressItemPage />}
            />
            <Route
              path="/jobs/in-progress"
              element={<JobsInProgressListPage />}
            />
            <Route path="/jobs/:id/action" element={<JobActionPage />} />
            <Route
              path="/jobs/:id/complete"
              element={<JobCompleteItemPage />}
            />
            {/* <Route path="/stocks/:id/stock-item" element={<StockItemPage />} /> */}
            <Route path="/stocks/list" element={<StocksListPage />} />
          </Route>
          {/* // % Admin only Routes */}
          <Route element={<RoleGaurdRoute allowedGroups={["admin"]} />}>
            <Route
              path="/jobs/pending-approval"
              element={<JobsPendingListPage />}
            />
            <Route path="/assets/list" element={<AssetsOverviewPage />} />
            {/* // $ Page to list an asset by id */}
            <Route path="/assets/:id" element={<AssetsSingleItemPage />} />
            <Route
              path="/jobs/:id/pending-approval"
              element={<JobPendingItemPage />}
            />
            <Route
              path="/assets/create-new-asset"
              element={<CreateAssetPage />}
            />
            <Route path="/assets/:id/history" element={<AssetHistoryPage />} />
            {/* // $ Page to create a new stock item */}
            <Route
              path="/stocks/create-new-stock"
              element={<CreateStockPage />}
            />
            {/* // $ Page to list all the users */}
            <Route path="/users" element={<UsersListPage />} />
            {/* // $ Page to show the profile of a user or store */}
            <Route path="/users/:id" element={<StoreProfilePage />} />
            <Route path="/users/create-user" element={<CreateUserPage />} />
          </Route>
          {/* //% admin, manager routes */}
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
              path="/jobs/:id/complete"
              element={<JobCompleteItemPage />}
            />
            <Route path="/jobs/completed" element={<JobsCompletedListPage />} />
          </Route>
        </Route>
      </Route>
      {/* FULL SCREEN ROUTES (no layout) */}
      <Route element={<RoleGaurdRoute allowedGroups={["admin", "manager"]} />}>
        <Route path="/assets/verification" element={<AssetVerification />} />
      </Route>
    </Routes>
  );
}

export default App;
