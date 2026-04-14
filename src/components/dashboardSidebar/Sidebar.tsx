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

const Sidebar = () => {
  const { isOpen } = useGlobalContext();
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
          <motion.div
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden z-200 w-(--sidebarWidth) fixed top-(--sm-navbarHeight) h-(--sm-sidebarHeight) md:h-(--lg-sidebarHeight) overflow-auto no-scrollbar border-r border-r-gray-200 dark:border-r-gray-700 bg-white dark:bg-(--bg-primary_dark)"
          >
            <SidebarContent userGroups={userGroups} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - always visible, never animated away */}
      <div className="hidden md:block z-200 w-(--sidebarWidth) fixed lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight) overflow-auto no-scrollbar border-r border-r-gray-200 dark:border-r-gray-700 bg-white dark:bg-(--bg-primary_dark)">
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
