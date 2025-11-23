import PageHeading from "./PageHeading";

type Props = {
  variant?: "mainPage" | "projectPage";
  className?: string;
  title: string;
};

export default function PageHeadingWithLines({
  title = "",
  variant,
  className,
}: Props) {
  return (
    <div className="flex gap-6 items-center justify-evenly h-full w-full">
      <PageHeading title={title} variant={variant} className={className} />
    </div>
  );
}
