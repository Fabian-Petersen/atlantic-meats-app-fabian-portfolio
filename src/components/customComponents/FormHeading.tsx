type FormHeadingProps = {
  heading: string;
  className?: string;
};

const FormHeading = ({ heading, className }: FormHeadingProps) => {
  return (
    <div className={`text-3xl ${className} text-(--clr-font)`}>
      <h2>{heading}</h2>
    </div>
  );
};

export default FormHeading;
