import { Outlet } from "react-router-dom";

// $ Page Features
import Navbar from "@/components/header/Navbar";
import ScrollToTopButton from "@/components/features/ScrollToTopButton";
import Sidebar from "@/components/dashboardSidebar/Sidebar";

// AppLayout.tsx
export const AppLayout = () => (
  <div className="min-h-screen grid grid-cols-1 lg:grid-rows-[4rem_1fr] lg:grid-cols-[15rem_1fr] grid-rows-[4rem_1fr] bg-gray-100 dark:bg-bgdark">
    <Navbar className="col-span-full row-start-1 row-end-1 h-16" />
    <ScrollToTopButton />
    <aside className="lg:block row-start-2 col-start-1">
      <Sidebar />
    </aside>
    <main className="row-start-2 col-start-1 lg:col-start-2 h-full w-full lg:max-w-screen">
      <Outlet />
    </main>
  </div>
);
