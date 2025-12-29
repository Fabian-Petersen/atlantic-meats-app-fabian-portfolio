import NavbarMenuButton from "./NavbarMenuButton";
import Logo from "./Logo";
import NavbarActionButtons from "./NavbarActionButtons";
import { useLocation } from "react-router-dom";

type Props = {
  className?: string;
};

const Navbar = ({ className }: Props) => {
  const { pathname } = useLocation();
  return (
    <nav
      className={`${className} fixed w-full justify-between px-4 bg-(--clr-primary) h-(--sm-navbarHeight) lg:h-(--lg-navbarHeight)`}
    >
      <div className="flex justify-between w-full h-full items-center">
        <Logo />
        {pathname !== "/" && (
          <div className="flex justify-between w-full">
            <NavbarMenuButton />
            <NavbarActionButtons />
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
