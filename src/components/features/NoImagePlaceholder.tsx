import { ImageOff } from "lucide-react";

type Props = {
  className?: string;
};

const NoImagePlaceholder = ({ className }: Props) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full w-full rounded-md 
      bg-gray-100 dark:bg-[#141c2f] text-gray-500 dark:text-gray-400 ${className}`}
    >
      <ImageOff size={48} className="mb-3 opacity-70" />
      <p className="text-sm font-medium">No images available</p>
    </div>
  );
};

export default NoImagePlaceholder;
