type Props = { height?: string; width?: string; className?: string };

export default function Separator({
  height = "0.15px",
  width,
  className,
}: Props) {
  return (
    <div
      className={`${className} mx-auto border-t dark:border-gray-100/20 border-gray-700/50`}
      style={{ borderTopWidth: height, width: width }}
    />
  );
}
