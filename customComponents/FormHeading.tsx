import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

type FormHeadingProps = {
  heading: string;
  className?: string;
  h3?: boolean;
  h2?: boolean;
};

const FormHeading = ({ heading, className, h3, h2 }: FormHeadingProps) => {
  return (
    <div
      className={cn(
        sharedStyles.heading,
        sharedStyles.formHeading,
        sharedStyles.TableHeading,
        className,
      )}
    >
      {h2 ? <h2>{heading}</h2> : h3 ? <h3>{heading}</h3> : <h1>{heading}</h1>}
    </div>
  );
};

export default FormHeading;
