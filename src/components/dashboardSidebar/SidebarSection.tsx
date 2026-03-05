import { Link } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";

// $ Components
import SidebarNavItem from "./SidebarNavItem";
import SectionHeading from "./SectionHeading";

import type { NavlinkProps } from "@/data/navbarLinks";
import type { UserGroup } from "@/data/navbarLinks";

type Props = {
  data: NavlinkProps[];
  heading: string;
  userGroups: UserGroup[];
};

const toLabel = (item: NavlinkProps, userGroups: UserGroup[]) =>
  typeof item.name === "function"
    ? item.name({ groups: userGroups })
    : item.name;

const toTitleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const SidebarSection = ({ data, heading, userGroups }: Props) => {
  const { activeItem, setActiveItem, setIsOpen } = useGlobalContext();

  const handleSidebarLinkClick = (itemName: string) => {
    setActiveItem(itemName);

    // $ On mobile close the sidebar
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const visibleLinks = data.filter((item) => {
    if (!item.allowedGroups) return true;

    return item.allowedGroups.some((group) => userGroups.includes(group));
  });

  if (!visibleLinks.length) return null;

  return (
    <section className="flex h-auto flex-col gap-4 lg:py-4 p-2">
      <SectionHeading heading={heading} className="text-xs" />
      <ul className="flex flex-col gap-3">
        {visibleLinks.map((item) => {
          const label = toLabel(item, userGroups);
          const itemKey = item.url; // stable key + active identifier
          return (
            <li key={itemKey} className="w-full">
              <Link to={item.url}>
                <SidebarNavItem
                  icon={item.icon}
                  url={item.url}
                  isActive={activeItem === item.name}
                  onClick={() => handleSidebarLinkClick(itemKey)}
                >
                  {toTitleCase(label)}
                </SidebarNavItem>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SidebarSection;
