import Sidebar from "@/components/dashboardSidebar/Sidebar";
import Navbar from "@/components/header/Navbar";
import { Outlet } from "react-router-dom";

// AppLayout.tsx
export const AppLayout = () => (
  <div className="min-h-screen grid grid-cols-1 lg:grid-rows-[6rem_1fr] lg:grid-cols-[15rem_1fr] grid-rows-[4rem_1fr] bg-gray-100">
    <Navbar className="col-span-full row-start-1" />
    <aside className="lg:block row-start-2 col-start-1">
      <Sidebar />
    </aside>
    <main className="row-start-2 col-start-1 lg:col-start-2 h-full w-full">
      <Outlet />
    </main>
  </div>
);
