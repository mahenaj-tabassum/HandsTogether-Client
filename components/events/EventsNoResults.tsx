import Link from "next/link";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsNoResults({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[32px] border border-border bg-card px-8 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-[20px] bg-muted text-primary">
        <CalendarX className="size-7" aria-hidden="true" />
      </span>
      <h2 className="font-(family-name:--font-jakarta) text-[28px] font-extrabold leading-tight tracking-tight">
        {hasFilters ? "No events found" : "No upcoming events yet"}
      </h2>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground">
        {hasFilters
          ? "Nothing matches right now. Try a different search or type, or be the first to organize something."
          : "Be the first to organize something good in your community."}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {/* ADJUST: your real Create Event route */}
        <Button asChild className="h-[52px] rounded-full px-7 font-semibold">
          <Link href="/events/create">Create an Event</Link>
        </Button>
        {hasFilters && (
          <Button
            asChild
            variant="outline"
            className="h-[52px] rounded-full px-7 font-semibold"
          >
            <Link href="/events">Clear filters</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
