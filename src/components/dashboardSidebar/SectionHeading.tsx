type FormHeadingProps = {
  heading: string;
  className?: string;
};

const SectionHeading = ({ heading, className }: FormHeadingProps) => {
  return (
    <div
      className={`tracking-wide ${className} px-2 capitalize text-gray-600 dark:text-gray-100`}
    >
      <h2>{heading}</h2>
    </div>
  );
};

export default SectionHeading;
