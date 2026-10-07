import clsx from "clsx";
import atlanticMeatLogo from "@/assets/atlantic_meat_logo_v1.jpg";

type Props = {
  className?: string;
};
const Logo = ({ className }: Props) => {
  return (
    <a
      href="https://www.atlanticmeat.co.za"
      aria-label="Visit the Atlantic Meat website"
      className={clsx(
        className,
        "block h-10 shrink-0 overflow-hidden rounded-sm md:h-12",
      )}
    >
      <img
        src={atlanticMeatLogo}
        alt="Atlantic Meat"
        className="h-full w-auto"
      />
    </a>
  );
};

export default Logo;
