import ThemeToggleButton from "@/components/header/ThemeToggleButton";
import LogoutButton from "./LogoutButton";
import Avatar from "./Avatar";
import NotificationButton from "../notifications/NotificationButton";
import UserDetails from "./UserDetails";
import { SearchInputBtn } from "./SearchInputBtn";
import { useMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavbarActionButtons = () => {
  const isDashboardPage = useMatch("/dashboard") !== null;
  const isCreateJobsPage = useMatch("/jobs/create-job") !== null;
  const isCreateStockPage = useMatch("/stocks/create-new-stock") !== null;
  const isCreateAssetPage = useMatch("/assets/create-new-asset") !== null;
  const isUserProfilePage = useMatch("/users/profile") !== null;

  const isHidden =
    isDashboardPage ||
    isCreateJobsPage ||
    isCreateStockPage ||
    isUserProfilePage ||
    isCreateAssetPage;

  return (
    <div className="flex items-center justify-between gap-2 md:gap-6">
      <div className="flex items-center justify-evenly">
        {/* UserDetails only visible on desktop inside the action bar */}
        <div className="hidden lg:flex">
          <UserDetails />
        </div>
        <AnimatePresence>
          {!isHidden && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <SearchInputBtn />
            </motion.div>
          )}
        </AnimatePresence>
        <ThemeToggleButton />
        <NotificationButton />
        <Avatar />
      </div>
      <LogoutButton />
    </div>
  );
};

export default NavbarActionButtons;
