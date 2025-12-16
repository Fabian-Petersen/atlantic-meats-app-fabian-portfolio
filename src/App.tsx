import "./index.css";
import Navbar from "@/components/header/Navbar";
import { useAuth } from "./auth/AuthContext";
import { Navigate, Outlet, Routes, Route } from "react-router-dom";

//$ Routes
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import Settings from "./pages/Settings";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
