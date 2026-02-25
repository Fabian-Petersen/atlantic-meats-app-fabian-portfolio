import { Button } from "../ui/button";

type Props = {
  redirect?: string;
  handleCancel?: () => void;
  action?: () => void;
  cancelText: string;
  submitText: string;
  disabled?: boolean;
};

function FormActionButtons({
  cancelText,
  action,
  disabled,
  submitText,
  handleCancel,
}: Props) {
  return (
    <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 mt-auto">
      <Button
        type="button"
        onClick={handleCancel}
        variant="cancel"
        size="lg"
        className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white capitalize"
      >
        {cancelText}
      </Button>
      <Button
        disabled={disabled}
        type="submit"
        variant="submit"
        size="lg"
        className="flex-1 capitalize"
        onClick={action}
      >
        {submitText}
      </Button>
    </div>
  );
}

export default FormActionButtons;
