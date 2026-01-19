import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  redirect: string;
  action?: () => void;
  redirectText: string;
  actionText: string;
  disabled?: boolean;
};

function FormActionButtons({
  redirect,
  redirectText,
  action,
  disabled,
  actionText,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 mt-auto">
      <Button
        type="button"
        onClick={() => {
          navigate(`${redirect}`);
        }}
        variant="cancel"
        size="lg"
        className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white capitalize"
      >
        {redirectText}
      </Button>
      <Button
        disabled={disabled}
        type="submit"
        variant="submit"
        size="lg"
        className="flex-1 capitalize"
        onClick={action}
      >
        {actionText}
      </Button>
    </div>
  );
}

export default FormActionButtons;
