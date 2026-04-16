import ThemeToggleButton from "@/components/header/ThemeToggleButton";
import LogoutButton from "./LogoutButton";
import Avatar from "./Avatar";
import NotificationButton from "../notifications/NotificationButton";
import UserDetails from "./UserDetails";

const NavbarActionButtons = () => {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-6">
      <div className="flex items-center justify-evenly">
        {/* UserDetails only visible on desktop inside the action bar */}
        <div className="hidden lg:flex">
          <UserDetails />
        </div>
        <ThemeToggleButton />
        <NotificationButton />
        <Avatar />
      </div>
      <LogoutButton />
    </div>
  );
};

export default NavbarActionButtons;
