import ThemeToggleButton from "@/components/header/ThemeToggleButton";
import LogoutButton from "./LogoutButton";
import Avatar from "./Avatar";
import NotificationButton from "../notifications/NotificationButton";
// import UserDetails from "./UserDetails";

const NavbarActionButtons = () => {
  return (
    <div className="flex items-center justify-center gap-2 lg:gap-3 px-2">
      <LogoutButton />
      <ThemeToggleButton />
      <NotificationButton />
      <Avatar />
    </div>
  );
};

export default NavbarActionButtons;
