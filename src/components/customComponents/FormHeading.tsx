type FormHeadingProps = {
  heading: string;
  className?: string;
};

const FormHeading = ({ heading, className }: FormHeadingProps) => {
  return (
    <div
      className={`text-lg lg:text-2xl ${className} w-full text-center lg:text-left`}
    >
      <h2>{heading}</h2>
    </div>
  );
};

export default FormHeading;
