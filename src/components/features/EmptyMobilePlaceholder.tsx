import { EmptyStateContent } from "./EmptyStateContent";

type Props = {
  message?: string;
};

const EmptyMobilePlaceholder = ({ message = "No items found" }: Props) => {
  return (
    <div className="w-full max-h-[calc(100dvh-var(--lg-navbarHeight))] flex justify-center bg-(--bg-secondary_light) dark:bg-(--bg-primary_dark) rounded-sm shadow-sm">
      <EmptyStateContent message={message} />
    </div>
  );
};

export default EmptyMobilePlaceholder;
