type Props = { height?: string };

export default function Separator({ height = "0.15px" }: Props) {
  return (
    <div
      className="w-[90%] mx-auto border-t border-gray-300"
      style={{ borderTopWidth: height }}
    />
  );
}
