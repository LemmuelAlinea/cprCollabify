interface Props {
  url: string | null;
  firstName: string;
  lastName: string;
  className?: string;
}

// Circular avatar; shows the image if set, otherwise gradient initials.
export function Avatar({ url, firstName, lastName, className = "h-10 w-10 text-sm" }: Props) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-brand-gradient font-600 text-white">
          {initials}
        </span>
      )}
    </span>
  );
}
