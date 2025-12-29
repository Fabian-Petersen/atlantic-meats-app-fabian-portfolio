import Separator from "./Seperator";

import {
  maintenanceLinks,
  assetLinks,
  mainLinks,
} from "../../data/navbarLinks";

import SidebarSection from "./SidebarSection";

import { useGlobalContext } from "../../useGlobalContext";

const Sidebar = () => {
  const { isOpen } = useGlobalContext();

  return (
    <div
      className={`z-1000 w-60 fixed top-(--sm-navbarHeight) lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight)
      bg-white transform transition-transform duration-75 ease-in lg:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full ease-out"}`}
    >
      <div className="flex flex-col h-full border-r border-r-gray-300 gap-2 mt-6">
        {/* Content */}
        <SidebarSection data={mainLinks} heading="Main" />
        <Separator />
        <SidebarSection data={maintenanceLinks} heading="Maintenance" />
        <Separator />
        <SidebarSection data={assetLinks} heading="Assets" />
      </div>
    </div>
  );
};

export default Sidebar;
