interface InitialsProps {
  name: string;
  surname: string;
  className?: string; // optional styling class
}

/**
 * Returns a React <span> containing the initials with optional styling.
 * Example: <span className="text-white bg-gray-500">FP</span>
 */
export function getInitialsElement({
  name,
  surname,
  className,
}: InitialsProps) {
  const firstInitial = name?.trim()?.[0]?.toUpperCase() || "";
  const lastInitial = surname?.trim()?.[0]?.toUpperCase() || "";
  // const initials = firstInitial + lastInitial;

  return (
    <div className={className}>
      <span className="">{firstInitial}</span>
      <span className="">{lastInitial}</span>
    </div>
  );
}
