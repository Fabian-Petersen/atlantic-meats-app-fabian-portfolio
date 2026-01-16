import { Inbox } from "lucide-react";

type Props = {
  colSpan: number;
  message?: string;
};

const EmptyTablePlaceholder = ({
  colSpan,
  message = "No items found",
}: Props) => {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div
          className="flex flex-col items-center justify-center py-12 text-gray-500 
          dark:text-gray-400"
        >
          <Inbox size={40} className="mb-3 opacity-70" />
          <p className="text-md font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
};

export default EmptyTablePlaceholder;
