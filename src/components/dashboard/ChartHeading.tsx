import { ChevronLeft, ChevronRight } from "lucide-react";
type Props = {
  title: string;
  className?: string;
  forwardAction?: boolean;
  returnAction?: boolean;
  onClick?: () => void;
};

function ChartHeading({
  title,
  className,
  returnAction,
  forwardAction,
  onClick,
}: Props) {
  return (
    <div className={`${className} flex items-center gap-3`}>
      {returnAction && (
        <button
          aria-label="return to dashboard"
          type="button"
          onClick={onClick}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:cursor-pointer"
        >
          <ChevronLeft />
        </button>
      )}
      <h3 className="tracking-wide">{title}</h3>
      {forwardAction && (
        <button
          aria-label="return to dashboard"
          type="button"
          onClick={onClick}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:cursor-pointer"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}

export default ChartHeading;
