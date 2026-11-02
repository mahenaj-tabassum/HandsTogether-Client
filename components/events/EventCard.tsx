import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventItem } from "@/types/event";
import { formatEventDate, formatEventTime } from "@/lib/date-format";
import { getTypeChipClass } from "@/lib/event-types";
import EventThumbnail from "./EventThumbnail";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-1">
      {/* Fixed height, so every thumbnail is the same size */}
      <div className="relative h-[180px] w-full overflow-hidden bg-muted">
        <EventThumbnail src={event.thumbnail} alt={event.title} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <span
          className={`self-start rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none ${getTypeChipClass(event.eventType)}`}
        >
          {event.eventType}
        </span>

        <h3 className="line-clamp-2 font-(family-name:--font-jakarta) text-[21px] font-bold leading-tight">
          {event.title}
        </h3>

        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{event.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            <span>
              <time dateTime={event.eventDate}>
                {formatEventDate(event.eventDate)}
              </time>
              {event.eventTime && <> · {formatEventTime(event.eventTime)}</>}
            </span>
          </li>
        </ul>

        {/* mt-auto pins the button to the bottom, so all buttons line up */}
        <Button
          asChild
          className="mt-auto h-12 rounded-full text-[15px] font-semibold transition-all duration-200 ease-out hover:shadow-md"
        >
          <Link href={`/events/${event._id}`}>
            View Event
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </article>
  );
}
