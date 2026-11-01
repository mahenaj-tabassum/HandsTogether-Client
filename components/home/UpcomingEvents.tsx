import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// ADJUST: same imports/props as your other sections
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";
import EventCard from "@/components/events/EventCard";
import EventsSkeleton from "@/components/events/EventsSkeleton";
import EventsEmptyState from "@/components/events/EventsEmptyState";
import EventsError from "@/components/events/EventsError";
import { getUpcomingEvents } from "@/lib/api/api";
import type { EventItem } from "@/types/event";

// This async component does the waiting. While it waits, Suspense shows the skeleton.
async function UpcomingEventsList() {
  let events: EventItem[];
  try {
    events = await getUpcomingEvents(6); // the assignment asks for 6 events
  } catch {
    return <EventsError />;
  }

  if (events.length === 0) return <EventsEmptyState />;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <li key={event._id} className="[&>div]:h-full">
          <Reveal delay={index * 80}>
            <EventCard event={event} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default function UpcomingEvents() {
  return (
    <section id="events" className="py-20 md:py-24">
      {/* ADJUST: same wrapper classes as the other sections */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Upcoming events"
            title="Happening soon"
            description="Pick an event and be part of something local."
          />
          {/* ADJUST: your real Upcoming Events route */}
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full px-6 font-semibold"
          >
            <Link href="/events">View all events</Link>
          </Button>
        </div>

        <Suspense fallback={<EventsSkeleton />}>
          <UpcomingEventsList />
        </Suspense>
      </div>
    </section>
  );
}
