import { Link } from "react-router-dom";

// $ Components
import SidebarNavItem from "./SidebarNavItem";
import SidebarLogoutButton from "./SidebarLogoutButton";
import SectionHeading from "./SectionHeading";
import Separator from "./Seperator";

import { maintenanceLinks, assetLinks } from "../../data/navbarLinks";

import { useGlobalContext } from "../../useGlobalContext";

const Sidebar = () => {
  const { setActiveItem, activeItem, isOpen } = useGlobalContext();

  return (
    <div
      className={`z-1000 w-60 fixed border border-t-amber-500 top-(--sm-navbarHeight) lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight)
      bg-(--clr-primary) transform transition-transform duration-75 ease-in lg:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full">
        {/* Content */}
        <div className="flex h-full flex-col py-2 lg:py-4">
          <SectionHeading heading="maintenance" />
          <ul className="flex flex-col pl-1">
            {maintenanceLinks.map((item) => (
              <li key={item.name}>
                <Link to={item.url}>
                  <SidebarNavItem
                    icon={item.icon}
                    url={item.url}
                    isActive={activeItem === item.name}
                    onClick={() => setActiveItem(item.name)}
                  >
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </SidebarNavItem>
                </Link>
              </li>
            ))}
          </ul>
          <Separator />
          {/* Assets */}
          <SectionHeading heading="assets" />
          <ul className="flex flex-col pl-1">
            {assetLinks.map((item) => (
              <li key={item.name}>
                <Link to={item.url}>
                  <SidebarNavItem
                    icon={item.icon}
                    url={item.url}
                    isActive={activeItem === item.name}
                    onClick={() => setActiveItem(item.name)}
                  >
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </SidebarNavItem>
                </Link>
              </li>
            ))}
          </ul>
          {/* Logout pinned to bottom */}
          <Separator />
        </div>
        <SidebarLogoutButton className="mt-auto" />
      </div>
    </div>
  );
};

export default Sidebar;
