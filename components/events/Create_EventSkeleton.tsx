import { Skeleton } from "@/components/ui/skeleton";

// Same two-column shape as the real form + preview, so nothing jumps when it loads.
export default function CreateEventSkeleton() {
  return (
    <div
      className="flex flex-wrap items-start gap-8"
      aria-busy="true"
      aria-label="Loading the event form"
    >
      <div className="flex flex-[1.5_1_440px] flex-col gap-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 motion-reduce:animate-none" />
            <Skeleton className="h-13 w-full rounded-xl motion-reduce:animate-none" />
          </div>
        ))}
        <Skeleton className="mt-2 h-13 w-40 rounded-full motion-reduce:animate-none" />
      </div>

      <div className="flex-[1_1_320px]">
        <Skeleton className="h-[380px] w-full rounded-3xl motion-reduce:animate-none" />
      </div>
    </div>
  );
}
