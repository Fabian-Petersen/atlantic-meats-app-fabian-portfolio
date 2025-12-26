type FormHeadingProps = {
  heading: string;
  className?: string;
};

const SectionHeading = ({ heading, className }: FormHeadingProps) => {
  return (
    <div className={`text-md ${className} text-gray-100 px-2 pb-1 capitalize`}>
      <h2>{heading}</h2>
    </div>
  );
};

export default SectionHeading;
