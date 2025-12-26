import Navbar from "@/components/header/Navbar";
import { Outlet } from "react-router-dom";

// PublicLayout.tsx
export const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);
