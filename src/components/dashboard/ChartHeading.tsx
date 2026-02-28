type Props = { title: string; className?: string };

function ChartHeading({ title, className }: Props) {
  return <h3 className={`${className} tracking-wide`}>{title}</h3>;
}

export default ChartHeading;
