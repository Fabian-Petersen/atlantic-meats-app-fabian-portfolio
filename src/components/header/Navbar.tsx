import NavbarMenuButton from "./NavbarMenuButton";
import Logo from "./Logo";
import NavbarActionButtons from "./NavbarActionButtons";
import { useLocation } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import UserDetails from "./UserDetails";

type Props = {
  className?: string;
};

const Navbar = ({ className }: Props) => {
  const { pathname } = useLocation();
  const isAuthPage = ["/", "/forgot-password", "/change-password"].includes(
    pathname,
  );

  return (
    <nav className={`${className} fixed z-20 w-full`}>
      {/* Row 1: authenticated logo + action icons */}
      <div
        className={`flex w-full items-center bg-primary px-2 md:px-4 md:py-2 ${
          isAuthPage ? "justify-end" : "justify-between"
        }`}
      >
        {isAuthPage ? (
          <ThemeToggleButton />
        ) : (
          <>
            <Logo />
            <div className="flex min-w-0 flex-1 justify-end pl-2 lg:pl-4">
              <NavbarActionButtons />
            </div>
          </>
        )}
      </div>

      {/* Row 2 (mobile only): Menu button + user context */}
      {!isAuthPage && (
        <div className="flex lg:hidden items-center justify-between px-3 py-1 bg-primary_red border-0">
          <NavbarMenuButton />
          <UserDetails />
        </div>
      )}
    </nav>
  );
};
// const Navbar = ({ className }: Props) => {
//   const { pathname } = useLocation();
//   return (
//     <nav
//       className={`${className} fixed z-200 w-full justify-between px-1 lg:px-4 bg-primary`}
//     >
//       <div className="flex justify-between w-full h-full items-center">
//         <Logo />
//         {pathname !== "/" && pathname !== "/forgot-password" ? (
//           <div className="flex justify-between w-full px-2 lg:px-4">
//             <NavbarMenuButton />
//             <NavbarActionButtons />
//           </div>
//         ) : (
//           <ThemeToggleButton className="" />
//         )}
//       </div>
//     </nav>
//   );
// };
export default Navbar;
