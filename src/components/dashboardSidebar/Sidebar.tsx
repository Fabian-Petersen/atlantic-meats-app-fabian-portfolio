// import Separator from "./Seperator";
import { Separator } from "../ui/separator";
import { getUserGroups } from "@/auth/getUserGroups";
import type { UserGroup } from "@/schemas/usersSchema";

// $ Animation
import { motion, AnimatePresence } from "framer-motion";

import {
  maintenanceLinks,
  assetLinks,
  mainLinks,
  profileLinks,
} from "../../data/navbarLinks";

import SidebarSection from "./SidebarSection";

import useGlobalContext from "../../context/useGlobalContext";
import { useState, useEffect } from "react";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

/**
 * Sidebar
 *
 * Responsive navigation sidebar that renders differently for mobile and desktop.
 *
 * Behavior:
 * - Mobile (md and below):
 *   - Conditionally rendered based on global `isOpen` state.
 *   - Full screen overlay close sidebar on click `setIsOpen` state to false.
 *   - Slides in/out from the left using Framer Motion animations.
 *   - Intended to be toggled via a menu button.
 *
 * - Desktop (md and above):
 *   - Always visible and statically rendered.
 *   - No animation applied.
 *
 * Data Flow:
 * - Fetches user group permissions on mount via `getUserGroups`.
 * - Stores groups in local state and passes them to child sections
 *   to control visibility of navigation links.
 *
 * Dependencies:
 * - `useGlobalContext` (custom context): provides `isOpen` state for mobile visibility.
 * - `getUserGroups`: async function to retrieve user role/group permissions.
 * - `framer-motion`: handles enter/exit animations (`motion`, `AnimatePresence`).
 * - `SidebarSection`: renders grouped navigation links.
 * - `Separator`: visual divider between sections.
 * - Navigation config: `mainLinks`, `maintenanceLinks`, `assetLinks`, `profileLinks`.
 *
 * Styling:
 * - TailwindCSS-based layout and theming.
 * - Uses CSS variables for sizing (e.g. `--sidebarWidth`, navbar heights).
 * - Scrollable with hidden scrollbar.
 *
 * Notes:
 * - Mobile sidebar is mounted/unmounted to enable animation via `AnimatePresence`.
 * - Desktop sidebar remains mounted for layout consistency.
 */

const Sidebar = () => {
  const { isOpen, setIsOpen } = useGlobalContext();
  // $ Get the groups to display what the user is allowed to see
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  useEffect(() => {
    const loadGroups = async () => {
      const groups = await getUserGroups();
      setUserGroups(groups);
      // console.log(groups);
    };
    loadGroups();
  }, []);

  return (
    <>
      {/* 
      Mobile: conditionally render with animation based on isOpen
      Desktop (md+): always render, no animation needed 
      */}

      {/* Mobile overlay - only mounted when isOpen */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <>
            {/* --------------------------------- Overlay -------------------------------- */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className={cn(sharedStyles.sidebarOverlay, "md:hidden")}
            />
            {/* --------------------------------- Sidebar -------------------------------- */}
            <motion.div
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={cn(sharedStyles.sidebar, sharedStyles.sidebarMobile)}
            >
              <SidebarContent userGroups={userGroups} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - always visible, never animated away */}
      <div className={cn(sharedStyles.sidebarDesktop, sharedStyles.sidebar)}>
        <SidebarContent userGroups={userGroups} />
      </div>
    </>
  );
};

// Extract shared content to avoid duplication
const SidebarContent = ({ userGroups }: { userGroups: UserGroup[] }) => (
  <div className="flex flex-col h-full gap-2 mt-6">
    <SidebarSection data={mainLinks} heading="Main" userGroups={userGroups} />
    <Separator />
    <SidebarSection
      data={maintenanceLinks}
      heading="Maintenance"
      userGroups={userGroups}
    />
    <Separator />
    <SidebarSection
      data={assetLinks}
      heading="Assets"
      userGroups={userGroups}
    />
    <Separator />
    <SidebarSection
      data={profileLinks}
      heading="Profile"
      userGroups={userGroups}
    />
  </div>
);

export default Sidebar;
