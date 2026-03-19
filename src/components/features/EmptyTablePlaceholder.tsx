import { EmptyStateContent } from "./EmptyStateContent";

type Props = {
  colSpan: number;
  message?: string;
};

const EmptyTablePlaceholder = ({
  colSpan,
  message = "No items found",
}: Props) => {
  return (
    <tr className="">
      <td colSpan={colSpan}>
        <EmptyStateContent message={message} />
      </td>
    </tr>
  );
};

export default EmptyTablePlaceholder;
