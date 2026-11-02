import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Heart,
  MapPin,
  Users,
} from "lucide-react";
import { getEventById } from "@/lib/api/api";
import { formatEventDate, formatEventTime } from "@/lib/date-format";
import { getTypeChipClass } from "@/lib/event-types";
import type { EventItem } from "@/types/event";
import EventThumbnail from "./EventThumbnail";
import EventsError from "./EventsError";
import EventDetailsSkeleton from "./EventDetailsSkeleton";
import JoinEventButton from "../joined/JoinEventButton";

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-muted text-primary">
        <Icon className="size-[22px]" aria-hidden="true" />
      </span>
      <div>
        <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 text-base font-semibold leading-snug">
          {children}
        </div>
      </div>
    </div>
  );
}

// Waits for params and the API. While it waits, Suspense shows the skeleton.
async function EventDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let event: EventItem | null;
  try {
    event = await getEventById(id);
  } catch {
    return <EventsError />;
  }
  if (!event) notFound();

  // Event dates are stored at midnight UTC, so compare against the start of today (UTC).
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const hasEnded = new Date(event.eventDate).getTime() < startOfToday.getTime();
  const spotsLeft = Math.max(event.capacity - event.joinedCount, 0);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
      <article className="min-w-0">
        <div className="relative h-[240px] w-full overflow-hidden rounded-[32px] bg-muted sm:h-[420px]">
          <EventThumbnail src={event.thumbnail} alt={event.title} />
        </div>

        <div className="mt-8">
          <span
            className={`inline-block rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none ${getTypeChipClass(event.eventType)}`}
          >
            {event.eventType}
          </span>
          <h1 className="mt-3.5 font-(family-name:--font-jakarta) text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            {event.title}
          </h1>
        </div>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="mb-3.5 font-(family-name:--font-jakarta) text-2xl font-bold">
            About this event
          </h2>
          {/* whitespace-pre-line keeps the line breaks the creator typed */}
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {event.description}
          </p>
        </section>
      </article>

      <aside className="rounded-3xl border border-border bg-card p-7 lg:sticky lg:top-24">
        <h2 className="font-(family-name:--font-jakarta) text-2xl font-bold">
          Event details
        </h2>
        <div className="mt-6 flex flex-col gap-5.5">
          <DetailRow icon={CalendarDays} label="Date">
            <time dateTime={event.eventDate}>
              {formatEventDate(event.eventDate)}
            </time>
          </DetailRow>
          <DetailRow icon={Clock} label="Time">
            {formatEventTime(event.eventTime)}
          </DetailRow>
          <DetailRow icon={MapPin} label="Location">
            {event.location}
          </DetailRow>
          <DetailRow icon={Heart} label="Event type">
            {event.eventType}
          </DetailRow>
          <DetailRow icon={Users} label="Spots">
            {spotsLeft === 0
              ? "Event is full"
              : `${spotsLeft} of ${event.capacity} spots left`}
          </DetailRow>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <JoinEventButton
            eventId={event._id}
            hasEnded={hasEnded}
            isFull={spotsLeft === 0}
          />
        </div>
      </aside>
    </div>
  );
}

export default function EventDetailsComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/events"
          className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-[18px]" aria-hidden="true" />
          Back to all events
        </Link>

        <div className="mt-3">
          <Suspense fallback={<EventDetailsSkeleton />}>
            <EventDetailsContent params={params} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
