import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <CalendarX2 className="size-6" aria-hidden="true" />
      </div>
      <h3 className="font-(family-name:--font-jakarta) text-xl font-bold">
        No upcoming events yet
      </h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Be the first to organize something good in your community.
      </p>
      {/* ADJUST: your real Create Event route */}
      <Button asChild className="mt-6 h-12 rounded-full px-7 font-semibold">
        <Link href="/create-event">Create an event</Link>
      </Button>
    </div>
  );
}
