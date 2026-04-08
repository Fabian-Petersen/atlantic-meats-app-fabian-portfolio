type FormHeadingProps = {
  heading: string;
  className?: string;
  h3?: boolean;
  h2?: boolean;
};

const FormHeading = ({ heading, className, h3, h2 }: FormHeadingProps) => {
  return (
    <div
      className={`text-2xl ${className} capitalize w-full dark:text-gray-100`}
    >
      {h2 ? <h2>{heading}</h2> : h3 ? <h3>{heading}</h3> : <h1>{heading}</h1>}
    </div>
  );
};

export default FormHeading;
