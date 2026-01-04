import NavbarMenuButton from "./NavbarMenuButton";
import Logo from "./Logo";
import NavbarActionButtons from "./NavbarActionButtons";
import { useLocation } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";

type Props = {
  className?: string;
};

const Navbar = ({ className }: Props) => {
  const { pathname } = useLocation();
  return (
    <nav
      className={`${className} fixed z-200 w-full justify-between px-4 bg-(--clr-primary)`}
    >
      <div className="flex justify-between w-full h-full items-center">
        <Logo />
        {pathname !== "/" ? (
          <div className="flex justify-between w-full">
            <NavbarMenuButton />
            <NavbarActionButtons />
          </div>
        ) : (
          <ThemeToggleButton className="px-4 lg:px-6" />
        )}
      </div>
    </nav>
  );
};
export default Navbar;
