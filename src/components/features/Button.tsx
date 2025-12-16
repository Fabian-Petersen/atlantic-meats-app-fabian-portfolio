// $ The component is used to create buttons in the app by passing in the various props to create the button

// Check out useFormStatus explanation from John Smilga on React Forms, section 10, lecture 32

type ButtonProps = {
  className?: string;
  buttonLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  children?: React.ReactNode;
};

const Button = ({
  className,
  buttonLabel,
  type,
  disabled,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {buttonLabel}
    </button>
  );
};

export default Button;
