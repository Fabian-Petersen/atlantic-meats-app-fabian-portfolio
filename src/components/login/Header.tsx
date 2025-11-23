type HeaderProps = { label: string };

const Header = ({ label }: HeaderProps) => {
  return (
    <div>
      <p className="w-full text-2xl dark:text-white text-gray-500 text-center">
        {label}
      </p>
    </div>
  );
};

export default Header;
