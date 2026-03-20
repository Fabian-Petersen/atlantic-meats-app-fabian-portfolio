// $ React Router
import { Link } from "react-router-dom";

// $ React Hooks
import { useState } from "react";

// $ Icons
import { ChevronDown } from "lucide-react";

// $ Components
import SidebarNavItem from "./SidebarNavItem";
import SectionHeading from "./SectionHeading";

// $ Components
import type { NavlinkProps } from "@/data/navbarLinks";

// $ Data
import type { UserGroup } from "@/data/navbarLinks";

// $ Global Context
import useGlobalContext from "@/context/useGlobalContext";

// $ Animation
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  data: NavlinkProps[];
  heading: string;
  userGroups: UserGroup[];
  defaultOpen?: boolean;
};

const toLabel = (item: NavlinkProps, userGroups: UserGroup[]) =>
  typeof item.name === "function"
    ? item.name({ groups: userGroups })
    : item.name;

const toTitleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const SidebarSection = ({
  data,
  heading,
  userGroups,
  defaultOpen = true,
}: Props) => {
  const { activeItem, setActiveItem, setIsOpen } = useGlobalContext();
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  const handleSidebarLinkClick = (itemName: string) => {
    setActiveItem(itemName);
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
      <button
        type="button"
        aria-label="sidebar toggle"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="hover:cursor-pointer flex items-center justify-between w-full group"
      >
        <SectionHeading heading={heading} className="text-xs" />
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground dark:text-white" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.ul
            key="sidebar-section-links"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-3 overflow-hidden"
          >
            {visibleLinks.map((item) => {
              const label = toLabel(item, userGroups);
              const itemKey = item.url;
              return (
                <motion.li key={itemKey} className="w-full">
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
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SidebarSection;

// import { Link } from "react-router-dom";
// import useGlobalContext from "@/context/useGlobalContext";

// // $ Components
// import SidebarNavItem from "./SidebarNavItem";
// import SectionHeading from "./SectionHeading";

// import type { NavlinkProps } from "@/data/navbarLinks";
// import type { UserGroup } from "@/data/navbarLinks";

// type Props = {
//   data: NavlinkProps[];
//   heading: string;
//   userGroups: UserGroup[];
// };

// const toLabel = (item: NavlinkProps, userGroups: UserGroup[]) =>
//   typeof item.name === "function"
//     ? item.name({ groups: userGroups })
//     : item.name;

// const toTitleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// const SidebarSection = ({ data, heading, userGroups }: Props) => {
//   const { activeItem, setActiveItem, setIsOpen } = useGlobalContext();

//   const handleSidebarLinkClick = (itemName: string) => {
//     setActiveItem(itemName);

//     // $ On mobile close the sidebar
//     setTimeout(() => {
//       setIsOpen(false);
//     }, 500);
//   };

//   const visibleLinks = data.filter((item) => {
//     if (!item.allowedGroups) return true;

//     return item.allowedGroups.some((group) => userGroups.includes(group));
//   });

//   if (!visibleLinks.length) return null;

//   return (
//     <section className="flex h-auto flex-col gap-4 lg:py-4 p-2">
//       <SectionHeading heading={heading} className="text-xs" />
//       <ul className="flex flex-col gap-3">
//         {visibleLinks.map((item) => {
//           const label = toLabel(item, userGroups);
//           const itemKey = item.url; // stable key + active identifier
//           return (
//             <li key={itemKey} className="w-full">
//               <Link to={item.url}>
//                 <SidebarNavItem
//                   icon={item.icon}
//                   url={item.url}
//                   isActive={activeItem === item.name}
//                   onClick={() => handleSidebarLinkClick(itemKey)}
//                 >
//                   {toTitleCase(label)}
//                 </SidebarNavItem>
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </section>
//   );
// };

// export default SidebarSection;
