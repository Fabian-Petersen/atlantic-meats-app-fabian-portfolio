import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  className?: string;
};
// Routes where logo should be visible on mobile
const LOGO_ROUTES = ["/", "/forgot-password", "/change-password"];

const Logo = ({ className }: Props) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Only show logo if current route is in allowed routes
  const isVisible = LOGO_ROUTES.includes(pathname);
  return (
    <div
      className={clsx(
        className,
        "hover:cursor-pointer h-12 max-h-24",
        isVisible ? "md:block" : "md:block", // This only display the logo when on "/" and when in desktop view
      )}
      onClick={() => navigate("https://www.atlanticmeat.co.za")}
    >
      <img
        src="https://www.atlanticmeat.co.za/assets/images/am20loyalty20logo-472x214.webp"
        alt="Logo"
        className="h-full w-auto"
      />
    </div>
  );
};

export default Logo;
