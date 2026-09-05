// import "./index.css";
import { Routes, Route } from "react-router-dom";

//$ Public Routes
import Login from "./pages/Login";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

//$ Protected Routes
import DashboardPage from "./pages/Dashboard";
import CreateJobPage from "./pages/jobs/CreateJobPage";
import AssetsOverviewPage from "./pages/assets/AssetsOverviewPage";

import { AppLayout } from "./routes/AppLayout";

// $ Gaurd Routes
import { ProtectedRoute } from "./routes/ProtectedRoute";
import RoleGaurdRoute from "./routes/RoleGaurdRoute";

//$ Page Layouts
// import JobItemPage from "./pages/JobApprovedItemPage";
// import JobActionItemPage from "./pages/JobActionPage";
import JobActionPage from "./pages/jobs/JobActionPage";

// $ Assets Pages
import CreateAssetPage from "./pages/assets/CreateAssetPage";
import AssetItemPage from "./pages/assets/AssetItemPage";
import AssetHistoryPage from "./pages/assets/AssetHistoryPage";
import AssetVerification from "./pages/assets/AssetVerification";

// $ User Management Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import StoreProfilePage from "./pages/StoreProfilePage";

// $ Job Management Pages for single items
import JobPendingItemPage from "./pages/jobs/JobPendingItemPage";
import JobInProgressItemPage from "./pages/jobs/JobInProgressItemPage";
import JobCompleteItemPage from "./pages/jobs/JobCompleteItemPage";
import JobsCompletedListPage from "./pages/jobs/JobsCompletedListPage";

// $ Pages display the list of items in a table
import JobsPendingListPage from "./pages/jobs/JobsPendingListPage";
import JobsInProgressListPage from "./pages/jobs/JobsInProgressListPage";
import { PageLoadingSpinner } from "./components/features/PageLoadingSpinner";
import UsersListPage from "./pages/users/UsersListPage";
import { useAuth } from "./auth/useAuth";
import CreateUserPage from "./pages/users/CreateUserPage";

// $ Transfer Asset Pages
// # ——————— Create Pages ————————————————————————————————————————————————————————
import CreateTransferPage from "./pages/transfers/CreateTransferPage";
import CreateTransferTransitPage from "./pages/transfers/CreateTransferTransitPage";
// # ——————— Tables Pages ————————————————————————————————————————————————————————
// import TransfersListPage from "./pages/transfers/TransfersListPage";
import TransferTransitListPage from "./pages/transfers/TransferTransitListPage";
import TransfersRequestsListPage from "./pages/transfers/TransfersRequestsListPage";
// # ——————— Display Item Pages ——————————————————————————————————————————————————
import TransferItemPage from "./pages/transfers/TransferItemPage";
import TransferPendingItemPage from "./pages/transfers/TransferPendingItemPage";

// $ Stock Pages
import CreateStockPage from "./pages/stocks/CreateStockPage";
import StocksListPage from "./pages/stocks/StocksListPage";
import CreateTransferReceiptPage from "./pages/transfers/CreateTransferReceiptPage";
import TransferCompleteListPage from "./pages/transfers/TransferCompleteListPage";
import CreateDisposalPage from "./pages/disposals/CreateDisposalPage";
import DisposalRequestsListPage from "./pages/disposals/DisposalRequestsListPage";
import DisposalPendingItemPage from "./pages/disposals/DisposalPendingItemPage";

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
                allowedGroups={["admin", "manager", "user", "maintenance"]}
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

            {/* // $ Transfer of an Asset Pages  */}
            <Route
              path="/transfers/create-new-transfer"
              element={<CreateTransferPage />}
            />
            <Route
              path="/transfers/in-transit"
              element={<TransferTransitListPage />}
            />
            <Route
              path="/transfers/:id/in-transit"
              element={<CreateTransferTransitPage />}
            />
            <Route
              path="/transfers/:id/receipt"
              element={<CreateTransferReceiptPage />}
            />
            <Route path="/transfers/:id" element={<TransferItemPage />} />
            <Route
              path="/transfers/completed"
              element={<TransferCompleteListPage />}
            />
            {/* // $ Disposal of an Asset Pages  */}
            <Route
              path="/disposals/create-new-disposal"
              element={<CreateDisposalPage />}
            />
          </Route>
          {/* // % Admin only Routes */}
          <Route element={<RoleGaurdRoute allowedGroups={["admin"]} />}>
            <Route
              path="/jobs/pending-approval"
              element={<JobsPendingListPage />}
            />
            <Route
              path="/transfers/requests"
              element={<TransfersRequestsListPage />}
            />
            <Route
              path="/disposals/requests"
              element={<DisposalRequestsListPage />}
            />
            <Route path="/assets/list" element={<AssetsOverviewPage />} />
            {/* // $ Page to list an asset by id */}
            <Route path="/assets/:id" element={<AssetItemPage />} />
            <Route
              path="/jobs/:id/pending-approval"
              element={<JobPendingItemPage />}
            />
            <Route
              path="/transfers/:id/pending-approval"
              element={<TransferPendingItemPage />}
            />
            <Route
              path="/disposals/:id/pending-approval"
              element={<DisposalPendingItemPage />}
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
          {/* //% admin, maintenance, contractor Routes */}
          <Route
            element={
              <RoleGaurdRoute
                allowedGroups={["contractor", "maintenance", "admin"]}
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
