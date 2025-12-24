type Props = { height: string };

export default function Separator({ height }: Props) {
  return (
    <div
      className="my-4 w-full border-t border-white dark:border-gray-700"
      style={{ borderTopWidth: height }}
    />
  );
}
