import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JoinedEvent } from "@/lib/api/api-client";
import { formatEventDate, formatEventTime } from "@/lib/date-format";
import { getTypeChipClass } from "@/lib/event-types";

export default function JoinedEventRow({
  event,
  isPast,
}: {
  event: JoinedEvent;
  isPast: boolean;
}) {
  // timeZone: "UTC" keeps the day the same as the backend stored it.
  const date = new Date(event.eventDate);
  const month = date
    .toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const day = date.toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: "UTC",
  });
  const joinedOn = new Date(event.joinedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-0.5 md:flex-row md:items-center md:gap-5 md:px-6">
      <div className="flex items-center gap-4 md:flex-1">
        {/* Date block */}
        <div
          className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-muted md:size-16"
          aria-hidden="true"
        >
          <span className="text-xs font-semibold text-muted-foreground">
            {month}
          </span>
          <span className="font-(family-name:--font-jakarta) text-xl font-extrabold leading-none">
            {day}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 font-(family-name:--font-jakarta) text-lg font-bold leading-tight">
            <Link
              href={`/events/${event._id}`}
              className="hover:underline focus-visible:underline"
            >
              {event.title}
            </Link>
          </h3>
          <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">{event.location}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              <time dateTime={event.eventDate}>
                {formatEventDate(event.eventDate)}
                {event.eventTime && <> · {formatEventTime(event.eventTime)}</>}
              </time>
            </li>
          </ul>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Joined {joinedOn} · {event.joinedCount} / {event.capacity} joined
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <span
          className={`rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none ${getTypeChipClass(event.eventType)}`}
        >
          {event.eventType}
        </span>
        {/* Text + icon, not colour alone */}
        <span
          className={`rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none ${
            isPast
              ? "bg-muted text-foreground"
              : "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
          }`}
        >
          {isPast ? "Completed" : "✓ Upcoming"}
        </span>
      </div>

      <Button
        asChild
        variant="outline"
        className="h-11 rounded-full px-5 font-semibold transition-all duration-200 ease-out hover:shadow-md max-md:w-full"
      >
        <Link href={`/events/${event._id}`}>
          View Event
          <ArrowRight
            className="size-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </Button>
    </article>
  );
}
