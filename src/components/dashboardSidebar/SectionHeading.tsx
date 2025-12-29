type FormHeadingProps = {
  heading: string;
  className?: string;
};

const SectionHeading = ({ heading, className }: FormHeadingProps) => {
  return (
    <div
      className={`text-sm tracking-wide font-semibold ${className} px-2 capitalize text-gray-600 `}
    >
      <h2>{heading}</h2>
    </div>
  );
};

export default SectionHeading;
