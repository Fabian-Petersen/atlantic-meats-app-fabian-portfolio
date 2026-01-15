import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ErrorPageProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export const ErrorPage = ({
  title = "Oops, something went wrong!!",
  message = "We couldn’t load the data. Please try again.",
  onRetry,
}: ErrorPageProps) => {
  const navigate = useNavigate();
  return (
    <div className="fixed z-100 h-screen top-0 left-0 w-full flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl dark:border-[rgba(55,65,81,0.5)] border border-gray-100 dark:bg-[#1d2739] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-200">
          <AlertTriangle size="36" className="text-red-500" />
        </div>

        <h1 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h1>

        <p className="mb-6 text-sm text-gray-600">{message}</p>

        {onRetry ? (
          <button
            onClick={onRetry}
            type="button"
            className="hover:cursor-pointer inline-flex items-center justify-center rounded-lg bg-primary/90 px-4 py-2 text-sm font-medium w-24 max-w-24 text-white transition hover:bg-primary hover:shadow-2xl"
          >
            Retry
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/maintenance-list")}
            className="hover:cursor-pointer inline-flex items-center justify-center rounded-lg bg-primary/90 px-4 py-2 text-sm font-medium w-24 max-w-24 text-white transition hover:bg-primary hover:shadow-2xl"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};
