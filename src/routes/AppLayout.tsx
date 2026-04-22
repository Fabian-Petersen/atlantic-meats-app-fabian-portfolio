import { Outlet } from "react-router-dom";

// $ Page Features
import Navbar from "@/components/header/Navbar";
import Sidebar from "@/components/dashboardSidebar/Sidebar";
import ModalManager from "@/components/modals/ModalManager";
import ChatSidebar from "@/components/comments/ChatSidebar";
import { Success } from "@/components/features/Success";
import NotificationSidebar from "@/components/notifications/NotificationSidebar";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

// AppLayout.tsx
export const AppLayout = () => (
  <div className={cn(sharedStyles.appLayout)}>
    <Navbar className="col-span-full row-start-1 row-end-1 md:h-(--lg-navbarHeight) h-(--sm-navbarHeight)" />
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
