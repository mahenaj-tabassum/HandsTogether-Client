import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="HandsTogether home"
      className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <rect width="64" height="64" rx="16" fill="#5B3FA8" />

        <g fill="none" strokeWidth="8" strokeLinecap="round">
          <path d="M18 15V49M18 32H30" stroke="#FFFFFF" />
          <path d="M46 15V49M46 32H34" stroke="#E6A94B" />
        </g>
      </svg>

      <span className="font-heading text-xl font-extrabold tracking-tight">
        HandsTogether
      </span>
    </Link>
  );
}
