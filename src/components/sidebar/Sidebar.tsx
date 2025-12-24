import Logo from "../header/Logo";
// import NavbarActionButtons from "./NavbarActionButtons";

const Navbar = () => {
  return (
    <aside className="fixed w-full justify-between px-4 bg-(--clr-primary) h-16 lg:h-24">
      <div className="flex justify-between w-full h-full items-center">
        <Logo />
        {/* <NavbarActionButtons /> */}
      </div>
    </aside>
  );
};
export default Navbar;
