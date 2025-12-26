type Props = { height?: string };

export default function Separator({ height = "0.15px" }: Props) {
  return (
    <div
      className="my-4 w-[90%] mx-auto border-t border-gray-100"
      style={{ borderTopWidth: height }}
    />
  );
}
