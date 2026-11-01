import { Skeleton } from "@/components/ui/skeleton";

// Same shape and size as EventCard, so nothing jumps when the real cards arrive.
export default function EventsSkeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading events"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
        >
          <Skeleton className="h-[180px] w-full rounded-none motion-reduce:animate-none" />
          <div className="flex flex-col gap-3 p-6">
            <Skeleton className="h-6 w-24 rounded-full motion-reduce:animate-none" />
            <Skeleton className="h-6 w-4/5 motion-reduce:animate-none" />
            <Skeleton className="h-4 w-1/2 motion-reduce:animate-none" />
            <Skeleton className="h-4 w-2/5 motion-reduce:animate-none" />
            <Skeleton className="mt-3 h-12 w-full rounded-full motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
