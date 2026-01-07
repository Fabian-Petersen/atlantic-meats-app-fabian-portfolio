type FormHeadingProps = {
  heading: string;
  className?: string;
};

const FormHeading = ({ heading, className }: FormHeadingProps) => {
  return (
    <div
      className={`text-lg lg:text-2xl ${className} capitalize w-full text-left dark:text-gray-100`}
    >
      <h2>{heading}</h2>
    </div>
  );
};

export default FormHeading;
