import { Link } from "react-router-dom";
import Logo from "../header/Logo";

// $ Components
import SidebarMenuButton from "./SidebarMenuButton";
import SidebarNavItem from "./SidebarNavItem";
import SidebarLogoutButton from "./SidebarLogoutButton";

import { navbarLinks } from "../../data/navbarLinks";

import { useGlobalContext } from "../../useGlobalContext";

const Sidebar = () => {
  const { setActiveItem, activeItem, isOpen } = useGlobalContext();

  return (
    <nav
      className={`fixed top-0 h-screen left-0 z-1000 w-[230px] lg:w-60
      bg-(--clr-primary) overflow-y-auto transform transition-transform duration-75 ease-in
    ${isOpen ? "translate-x-0" : "-translate-x-0"}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <Logo className="hidden lg:block w-full h-32" />
        {/* Mobile menu button */}
        <SidebarMenuButton className="block lg:hidden" />
        {/* Content */}
        <div className="flex h-full flex-col text-gray-100 py-24 lg:py-4">
          <ul className="flex flex-col gap-4 pl-1">
            {navbarLinks.map((item) => (
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
        </div>
        <SidebarLogoutButton className="mt-auto" />
      </div>
    </nav>
  );
};

export default Sidebar;
