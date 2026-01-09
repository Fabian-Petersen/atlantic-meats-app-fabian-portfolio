import Separator from "./Seperator";

import {
  maintenanceLinks,
  assetLinks,
  mainLinks,
  profileLinks,
} from "../../data/navbarLinks";

import SidebarSection from "./SidebarSection";

import useGlobalContext from "../../context/useGlobalContext";

const Sidebar = () => {
  const { isOpen } = useGlobalContext();

  return (
    <div
      className={`z-200 w-60 fixed top-16 lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight) border-r border-r-gray-200 dark:border-r-[rgba(55,65,81,0.5)]
      bg-white dark:bg-bgdark transform transition-transform duration-75 ease-in lg:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full ease-out"}`}
    >
      <div className="flex flex-col h-full gap-2 mt-6">
        {/* Content */}
        <SidebarSection data={mainLinks} heading="Main" />
        <Separator />
        <SidebarSection data={maintenanceLinks} heading="Maintenance" />
        <Separator />
        <SidebarSection data={assetLinks} heading="Assets" />
        <Separator />
        <SidebarSection data={profileLinks} heading="Profile" />
      </div>
    </div>
  );
};

export default Sidebar;
