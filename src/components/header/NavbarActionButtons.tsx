import ThemeToggleButton from "@/components/header/ThemeToggleButton";
import LogoutButton from "./LogoutButton";

const NavbarActionButtons = () => {
  return (
    <div className="flex items-center justify-center gap-6">
      <ThemeToggleButton />
      <LogoutButton />
    </div>
  );
};

export default NavbarActionButtons;
