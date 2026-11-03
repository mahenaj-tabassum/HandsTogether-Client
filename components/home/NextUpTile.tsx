import { Suspense } from "react";
import Link from "next/link";
import { getUpcomingEvents } from "@/lib/api/api";
import type { EventItem } from "@/types/event";
import { formatEventDate } from "@/lib/date-format";
import { connection } from "next/server";

// Same classes for the loaded tile and the skeleton, so nothing jumps when data arrives.
const tileClass =
  "flex flex-col justify-end rounded-tile bg-accent p-5 text-accent-foreground sm:p-6";

async function NextUpContent() {
  await connection()
  let event: EventItem | undefined;
  try {
    [event] = await getUpcomingEvents(1); // server already sorts soonest first
  } catch (error) {
    console.error(error); // no event shown, but the page still works
  }

  if (!event) {
    return (
      <Link
        href="/events"
        className={`${tileClass} transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.08em]">
          Next up
        </span>
        <p className="mt-1.5 font-heading text-[19px] font-bold leading-tight">
          No upcoming events yet
        </p>
        <p className="mt-1 text-sm font-medium">Be the first to create one</p>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event._id}`}
      className={`${tileClass} transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.08em]">
        Next up
      </span>
      <p className="mt-1.5 line-clamp-2 font-heading text-[19px] font-bold leading-tight">
        {event.title}
      </p>
      <p className="mt-1 text-sm font-medium">{formatEventDate(event.eventDate)}</p>
    </Link>
  );
}

function NextUpSkeleton() {
  return (
    <div className={tileClass} aria-hidden="true">
      <div className="h-3 w-16 rounded bg-accent-foreground/20 motion-safe:animate-pulse" />
      <div className="mt-3 h-5 w-3/4 rounded bg-accent-foreground/20 motion-safe:animate-pulse" />
      <div className="mt-2 h-4 w-1/3 rounded bg-accent-foreground/20 motion-safe:animate-pulse" />
    </div>
  );
}

export default function NextUpTile() {
  return (
    <Suspense fallback={<NextUpSkeleton />}>
      <NextUpContent />
    </Suspense>
  );
}
