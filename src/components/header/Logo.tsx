import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  className?: string;
};
const Logo = ({ className }: Props) => {
  const { pathname } = useLocation();
  const isRoot = pathname === "/";
  const navigate = useNavigate();
  return (
    <div
      className={clsx(
        className,
        "hover:cursor-pointer h-16 max-h-24",
        isRoot ? "lg:block" : "hidden lg:block" // This only display the logo when on "/" and when in desktop view
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
