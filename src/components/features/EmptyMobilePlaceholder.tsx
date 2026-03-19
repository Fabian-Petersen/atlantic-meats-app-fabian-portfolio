import { EmptyStateContent } from "./EmptyStateContent";

type Props = {
  message?: string;
};

const EmptyMobilePlaceholder = ({ message = "No items found" }: Props) => {
  return (
    <div className="w-full h-[calc(100dvh-var(--lg-navbarHeight))] flex justify-center items-center">
      <EmptyStateContent message={message} />
    </div>
  );
};

export default EmptyMobilePlaceholder;
