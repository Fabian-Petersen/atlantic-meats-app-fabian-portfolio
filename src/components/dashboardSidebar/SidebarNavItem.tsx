import React from "react";
import type { IconType } from "react-icons";
import { useLocation } from "react-router-dom";

interface NavItemProps {
  icon: IconType;
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  url: string;
}

const usePath = () => {
  const location = useLocation();
  return location.pathname.replace(/\/$/, "");
};

const SidebarNavItem = ({
  icon: Icon,
  children,
  onClick,
  url,
}: NavItemProps) => {
  const path = usePath();
  const isActive = path === url;

  return (
    <div className="w-full list-none">
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center gap-4 py-3 text-black transition-all duration-150 hover:bg-(--clr-primary) hover:font-medium hover:cursor-pointer
          ${
            isActive
              ? "pl-3 bg-primary border-l-4 border-(--clr-primary)"
              : "pl-4"
          }`}
      >
        <Icon size={18} />
        <span className="text-lg lg:text-xl capitalize">{children}</span>
      </button>
    </div>
  );
};

export default SidebarNavItem;
