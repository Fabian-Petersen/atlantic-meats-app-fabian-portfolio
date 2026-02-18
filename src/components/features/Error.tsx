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
      <div className="flex flex-col items-center justify-center md:gap-6 w-full max-w-lg rounded-2xl md:h-96 h-88 dark:border-[rgba(55,65,81,0.5)] border border-gray-100 dark:bg-[#1d2739] bg-white p-4 lg:p-8 text-center shadow-sm">
        <div className="mb-4 flex size-20 md:size-28 items-center justify-center rounded-full bg-red-200">
          <AlertTriangle className="size-12 md:size-16 text-red-500" />
        </div>

        <div>
          <h1 className="mb-2 text-xl tracking-wide font-medium text-gray-700 dark:text-gray-200">
            {title}
          </h1>
          <p className="mb-6 text-md tracking-wide text-gray-600">{message}</p>
        </div>

        {onRetry ? (
          <div>
            <button
              onClick={onRetry}
              type="button"
              className="hover:cursor-pointer inline-flex items-center justify-center rounded-xl bg-primary/90 p-3 text-md lg:text-lg font-medium w-36 max-w-42 text-white transition hover:bg-primary hover:shadow-2xl"
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => navigate("/maintenance-list")}
              className="hover:cursor-pointer inline-flex items-center justify-center rounded-lg bg-primary/90 px-4 py-2 text-sm font-medium w-24 max-w-24 text-white transition hover:bg-primary hover:shadow-2xl"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
