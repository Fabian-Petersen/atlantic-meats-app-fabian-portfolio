import { cn } from "@/lib/utils";

type Props = { height?: string; width?: string; className?: string };

export default function Separator({
  height = "0.15px",
  width,
  className,
}: Props) {
  return (
    <div
      className={cn(
        `mx-auto border-t dark:border-gray-100/20 border-gray-400/20 ${
          className
        }`,
      )}
      style={{ height, width }}
    />
  );
}
