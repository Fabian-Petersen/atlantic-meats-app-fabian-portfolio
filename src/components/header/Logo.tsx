import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="hover:cursor-pointer h-full"
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
