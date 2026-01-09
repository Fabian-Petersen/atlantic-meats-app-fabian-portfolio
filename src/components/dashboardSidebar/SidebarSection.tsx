import { Link } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";

// $ Components
import SidebarNavItem from "./SidebarNavItem";
import SectionHeading from "./SectionHeading";

import type { NavlinkProps } from "@/data/navbarLinks";

type Props = {
  data: NavlinkProps[];
  heading: string;
};

const SidebarSection = ({ data, heading }: Props) => {
  const { activeItem, setActiveItem, setIsOpen } = useGlobalContext();

  const handleSidebarLinkClick = (itemName: string) => {
    setActiveItem(itemName);

    // $ On mobile close the sidebar
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  return (
    <section className="flex h-auto flex-col gap-4 lg:py-4 p-2">
      <SectionHeading heading={heading} />
      <ul className="flex flex-col gap-4">
        {data.map((item) => (
          <li key={item.name} className="w-full">
            <Link to={item.url}>
              <SidebarNavItem
                icon={item.icon}
                url={item.url}
                isActive={activeItem === item.name}
                onClick={() => handleSidebarLinkClick(item.name)}
              >
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </SidebarNavItem>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SidebarSection;
