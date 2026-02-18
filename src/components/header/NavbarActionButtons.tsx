import ThemeToggleButton from "@/components/header/ThemeToggleButton";
import LogoutButton from "./LogoutButton";
import Avatar from "./Avatar";

const NavbarActionButtons = () => {
  return (
    <div className="flex items-center justify-center gap-6">
      <ThemeToggleButton />
      <LogoutButton />
      <Avatar />
    </div>
  );
};

export default NavbarActionButtons;
