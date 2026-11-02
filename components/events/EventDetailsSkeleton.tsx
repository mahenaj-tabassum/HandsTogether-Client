import { Skeleton } from "@/components/ui/skeleton"; // npx shadcn@latest add skeleton (if missing)

export default function EventDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading event"
      className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]"
    >
      <div>
        <Skeleton className="h-[240px] w-full rounded-[32px] sm:h-[420px]" />
        <Skeleton className="mt-8 h-7 w-24 rounded-full" />
        <Skeleton className="mt-4 h-12 w-3/4" />
        <Skeleton className="mt-8 h-52 w-full rounded-3xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-3xl" />
    </div>
  );
}
