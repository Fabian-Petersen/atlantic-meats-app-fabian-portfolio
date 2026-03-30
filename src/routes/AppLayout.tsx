import { Outlet } from "react-router-dom";

// $ Page Features
import Navbar from "@/components/header/Navbar";
import Sidebar from "@/components/dashboardSidebar/Sidebar";
import ModalManager from "@/components/modals/ModalManager";
import ChatSidebar from "@/components/comments/ChatSidebar";
import { Success } from "@/components/features/Success";
import NotificationSidebar from "@/components/notifications/NotificationSidebar";

// AppLayout.tsx
export const AppLayout = () => (
  <div className="min-h-screen w-full grid grid-cols-1 lg:grid-rows-[4rem_1fr] lg:grid-cols-[15rem_1fr] grid-rows-[4rem_1fr] bg-gray-100 dark:bg-bgdark">
    <Navbar className="col-span-full row-start-1 row-end-1 h-16" />
    <ChatSidebar />
    <NotificationSidebar />
    <Success />
    <aside className="lg:block row-start-2 col-start-1">
      <Sidebar />
    </aside>
    <main className="row-start-2 col-start-1 lg:col-start-2 min-h-0 w-full lg:max-w-screen">
      <Outlet />
    </main>
    <ModalManager />
  </div>
);
