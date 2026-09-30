// import "./index.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

//$ Public Routes
import Login from "./pages/Login";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

//$ Protected Routes
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const CreateJobPage = lazy(() => import("./pages/jobs/CreateJobPage"));
const AssetsOverviewPage = lazy(
  () => import("./pages/assets/AssetsOverviewPage"),
);

import { AppLayout } from "./routes/AppLayout";

// $ Gaurd Routes
import { ProtectedRoute } from "./routes/ProtectedRoute";
import RoleGaurdRoute from "./routes/RoleGaurdRoute";

//$ Page Layouts
const JobActionPage = lazy(() => import("./pages/jobs/JobActionPage"));

// $ Assets Pages
const CreateAssetPage = lazy(() => import("./pages/assets/CreateAssetPage"));
const AssetItemPage = lazy(() => import("./pages/assets/AssetItemPage"));
const AssetHistoryPage = lazy(() => import("./pages/assets/AssetHistoryPage"));
const AssetVerification = lazy(
  () => import("./pages/assets/AssetVerification"),
);

// $ User Management Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
const UserProfilePage = lazy(() => import("./pages/users/UserProfilePage"));
const StoreProfilePage = lazy(() => import("./pages/StoreProfilePage"));

// $ Job Management Pages for single items
const JobPendingItemPage = lazy(
  () => import("./pages/jobs/JobPendingItemPage"),
);
const JobInProgressItemPage = lazy(
  () => import("./pages/jobs/JobInProgressItemPage"),
);
const JobCompleteItemPage = lazy(
  () => import("./pages/jobs/JobCompleteItemPage"),
);
const JobsCompletedListPage = lazy(
  () => import("./pages/jobs/JobsCompletedListPage"),
);

// $ Pages display the list of items in a table
const JobsPendingListPage = lazy(
  () => import("./pages/jobs/JobsPendingListPage"),
);
const JobsInProgressListPage = lazy(
  () => import("./pages/jobs/JobsInProgressListPage"),
);
import { PageLoadingSpinner } from "./components/features/PageLoadingSpinner";
const UsersListPage = lazy(() => import("./pages/users/UsersListPage"));
import { useAuth } from "./auth/useAuth";
const CreateUserPage = lazy(() => import("./pages/users/CreateUserPage"));

// $ Transfer Asset Pages
// # ——————— Create Pages ————————————————————————————————————————————————————————
const CreateTransferPage = lazy(
  () => import("./pages/transfers/CreateTransferPage"),
);
const CreateTransferTransitPage = lazy(
  () => import("./pages/transfers/CreateTransferTransitPage"),
);
// # ——————— Tables Pages ————————————————————————————————————————————————————————
// import TransfersListPage from "./pages/transfers/TransfersListPage";
const TransferTransitListPage = lazy(
  () => import("./pages/transfers/TransferTransitListPage"),
);
const TransfersRequestsListPage = lazy(
  () => import("./pages/transfers/TransfersRequestsListPage"),
);
const TransferCompleteListPage = lazy(
  () => import("./pages/transfers/TransferCompleteListPage"),
);
// # ——————— Display Item Pages ——————————————————————————————————————————————————
const TransferItemPage = lazy(
  () => import("./pages/transfers/TransferItemPage"),
);
const TransferPendingItemPage = lazy(
  () => import("./pages/transfers/TransferPendingItemPage"),
);

// $ Disposal Asset Pages
// # ——————— Create Pages ————————————————————————————————————————————————————————
const CreateDisposalPage = lazy(
  () => import("./pages/disposals/CreateDisposalPage"),
);
const CreateDisposalCompletePage = lazy(
  () => import("./pages/disposals/CreateDisposalCompletePage"),
);
const CreateTransferReceiptPage = lazy(
  () => import("./pages/transfers/CreateTransferReceiptPage"),
);

// # ——————— Tables Pages ————————————————————————————————————————————————————————
const DisposalRequestsListPage = lazy(
  () => import("./pages/disposals/DisposalRequestsListPage"),
);
const DisposalCompletedListPage = lazy(
  () => import("./pages/disposals/DisposalCompletedListPage"),
);

// # ——————— Display Item Pages ——————————————————————————————————————————————————
const DisposalItemPage = lazy(
  () => import("./pages/disposals/DisposalItemPage"),
);
const DisposalPendingItemPage = lazy(
  () => import("./pages/disposals/DisposalPendingItemPage"),
);

// $ Stock Pages
const CreateStockPage = lazy(() => import("./pages/stocks/CreateStockPage"));
const StocksListPage = lazy(() => import("./pages/stocks/StocksListPage"));
const UpdateAssetPage = lazy(() => import("./pages/assets/UpdateAssetPage"));

function App() {
  const { loading } = useAuth();

  // Don't render routes (and trigger API calls) until Amplify has rehydrated
  if (loading) return <PageLoadingSpinner />;

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
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
            <Route path="/disposals/:id" element={<DisposalItemPage />} />
            <Route
              path="/disposals/:id/completed"
              element={<CreateDisposalCompletePage />}
            />
            <Route
              path="/disposals/completed"
              element={<DisposalCompletedListPage />}
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
            <Route
              path="/assets/verification/manual"
              element={<AssetsOverviewPage />}
            />
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
            <Route
              path="/assets/:id/update-asset"
              element={<UpdateAssetPage />}
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
    </Suspense>
  );
}

export default App;
