import Logo from "./Logo";
// import NavbarActionButtons from "./NavbarActionButtons";

const Navbar = () => {
  return (
    <nav className="fixed w-full justify-between px-4 bg-(--clr-primary) h-16 lg:h-24">
      <div className="flex justify-between w-full h-full items-center">
        <Logo />
        {/* <NavbarActionButtons /> */}
      </div>
    </nav>
  );
};
export default Navbar;
