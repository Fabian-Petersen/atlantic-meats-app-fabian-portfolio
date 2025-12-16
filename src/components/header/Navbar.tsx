// import Logo from "./Logo";
import NavbarActionButtons from "./NavbarActionButtons";

const Navbar = () => {
  return (
    <nav className="flex w-full justify-end p-4">
      {/* <Logo variant="navbar" /> */}
      <NavbarActionButtons />
    </nav>
  );
};
export default Navbar;
