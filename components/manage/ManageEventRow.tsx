import Link from "next/link";
import { MapPin, Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventThumbnail from "@/components/events/EventThumbnail";
import type { EventItem } from "@/types/event";
import { formatEventDate, formatEventTime } from "@/lib/date-format";
import { getTypeChipClass } from "@/lib/event-types";
import { hasEnded } from "@/lib/joined-events";

export default function ManageEventRow({
  event,
  onEdit,
  onDelete,
}: {
  event: EventItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const ended = hasEnded(event.eventDate);

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 transition-[box-shadow,border-color] duration-300 ease-out hover:border-primary/40 hover:shadow-lg md:flex-row md:items-center md:pr-6">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-muted md:h-[84px] md:w-[120px]">
        <EventThumbnail src={event.thumbnail} alt="" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none ${getTypeChipClass(event.eventType)}`}
          >
            {event.eventType}
          </span>
          {ended && (
            <span className="rounded-full bg-muted px-3 py-1.5 text-[13px] font-semibold leading-none">
              Ended
            </span>
          )}
        </div>
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
          <li>
            {event.joinedCount} / {event.capacity} joined
          </li>
        </ul>
      </div>

      <div className="flex gap-3 max-md:w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          aria-label={`Edit ${event.title}`}
          className="h-11 rounded-full px-5 font-semibold max-md:flex-1"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDelete}
          aria-label={`Delete ${event.title}`}
          className="h-11 rounded-full border-destructive px-5 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive max-md:flex-1"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </article>
  );
}
