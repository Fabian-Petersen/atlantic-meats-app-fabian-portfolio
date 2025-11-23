import React from "react";
import { FaCheckCircle } from "react-icons/fa";

type FormSuccessProps = {
  message?: string;
};

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/10 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <FaCheckCircle className="h4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
