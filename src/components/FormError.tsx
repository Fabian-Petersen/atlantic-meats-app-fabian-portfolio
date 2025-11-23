import { FaExclamationTriangle } from "react-icons/fa";

type FormErrorProps = {
  message?: string;
};

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
      <FaExclamationTriangle className="h4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
