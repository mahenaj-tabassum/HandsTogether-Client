// components/joined/JoinedEventsSkeleton.tsx
function Bar({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted motion-reduce:animate-none ${className}`}
    />
  );
}

export default function JoinedEventsSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="Loading your events"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="flex items-center gap-5 rounded-3xl border border-border bg-card px-6 py-5"
        >
          <Bar className="size-16 shrink-0 rounded-2xl" />
          <div className="flex flex-1 flex-col gap-2.5">
            <Bar className="h-5 w-2/5" />
            <Bar className="h-3.5 w-1/4" />
          </div>
          <Bar className="hidden h-6 w-20 rounded-full md:block" />
          <Bar className="hidden h-10 w-32 rounded-full md:block" />
        </div>
      ))}
    </div>
  );
}
