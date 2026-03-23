// import Separator from "./Seperator";
import { Separator } from "../ui/separator";
import { getUserGroups } from "@/auth/getUserGroups";
import type { UserGroup } from "../../data/navbarLinks";

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
    };

    loadGroups();
  }, []);

  return (
    <AnimatePresence initial={false}>
      {(isOpen ||
        (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
        <motion.div
          key="sidebar"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="z-200 w-60 fixed top-16 lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight) overflow-auto no-scrollbar border-r border-r-gray-200 dark:border-r-gray-700 bg-white dark:bg-(--bg-primary_dark) lg:translate-x-0"
        >
          <div className="flex flex-col h-full gap-2 mt-6">
            {/* Content */}
            <SidebarSection
              data={mainLinks}
              heading="Main"
              userGroups={userGroups}
            />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
