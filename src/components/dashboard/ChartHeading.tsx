type Props = { title: string; className?: string };

function ChartHeading({ title }: Props) {
  return <h3 className={`$className`}>{title}</h3>;
}

export default ChartHeading;
