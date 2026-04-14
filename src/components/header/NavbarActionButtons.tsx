import ThemeToggleButton from "@/components/header/ThemeToggleButton";
import LogoutButton from "./LogoutButton";
import Avatar from "./Avatar";
import NotificationButton from "../notifications/NotificationButton";
import UserDetails from "./UserDetails";

const NavbarActionButtons = () => {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {/* UserDetails only visible on desktop inside the action bar */}
      <div className="hidden lg:flex">
        <UserDetails />
      </div>
      <ThemeToggleButton />
      <NotificationButton />
      <Avatar />
      <LogoutButton />
    </div>
  );
};

export default NavbarActionButtons;
