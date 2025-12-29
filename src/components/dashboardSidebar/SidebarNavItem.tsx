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
        className={`group flex p-2 w-full rounded-lg items-center gap-4 py-3 px-4 text-gray-600 bg-gray-200 transition-all duration-150 hover:font-medium hover:cursor-pointer ${
          isActive && "bg-primary/90 tracking-wide` hover:bg-primary"
        }`}
      >
        <Icon size={24} />
        <span className="lg:text-md text-md capitalize">{children}</span>
      </button>
    </div>
  );
};

export default SidebarNavItem;
// ${isActive ? "pl-3 bg-primary border-l-4 border-red-400" : "pl-4"}`}
