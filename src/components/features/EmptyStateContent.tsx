// $ This component is used to reuse the logic inside a placeholder for the Mobile and Table contents e.g. when no requests exist <EmptyTablePlaceholder/> and <MobileEmptyPlaceholder/>

import { Inbox } from "lucide-react";

type Props = {
  message?: string;
};

export const EmptyStateContent = ({ message = "No items found" }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <Inbox size={40} className="mb-3 opacity-70" />
      <p className="text-sm lg:text-md font-medium">{message}</p>
    </div>
  );
};
