// components/joined/JoinedEmptyState.tsx
import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tab } from "@/lib/joined-events";

export default function JoinedEmptyState({ tab }: { tab: Tab }) {
  const upcoming = tab === "upcoming";
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-[20px] bg-muted">
        <CalendarX2 className="size-7" aria-hidden="true" />
      </div>
      <h2 className="font-(family-name:--font-jakarta) text-2xl font-extrabold">
        {upcoming ? "No upcoming events yet" : "No past events yet"}
      </h2>
      <p className="mx-auto mt-2.5 max-w-md leading-relaxed text-muted-foreground">
        {upcoming
          ? "Events you join will show up here, sorted by date. Find a cause near you and sign up in one click."
          : "Events you have attended will appear here once they are over."}
      </p>
      {upcoming && (
        <Button
          asChild
          className="mt-6 h-[52px] rounded-full px-7 font-semibold"
        >
          <Link href="/events">Explore Events</Link>
        </Button>
      )}
    </div>
  );
}
