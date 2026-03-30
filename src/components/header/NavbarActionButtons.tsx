import ThemeToggleButton from "@/components/header/ThemeToggleButton";
import LogoutButton from "./LogoutButton";
// import Avatar from "./Avatar";
import NotificationButton from "../notifications/NotificationButton";

const NavbarActionButtons = () => {
  return (
    <div className="flex items-center justify-center gap-2 lg:gap-4">
      <ThemeToggleButton />
      <NotificationButton />
      <LogoutButton />
      {/* <Avatar /> */}
    </div>
  );
};

export default NavbarActionButtons;
