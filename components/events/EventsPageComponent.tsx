import { Suspense } from "react";
import EventsToolbar from "./EventsToolbar";
import EventsResults, { type SearchParams } from "./EventsResults";
import EventsSkeleton from "./EventsSkeleton";

// ADJUST: must match src/utils/eventTypes.js on the server.
// If your lib/event-types already exports this list, import it instead.
const EVENT_TYPES = [
  "Plantation",
  "Donation",
  "Cleanup",
  "Education",
  "Health",
];

export default function EventsPageComponent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-xl">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
            Upcoming events
          </span>
          <h1 className="mt-3 font-(family-name:--font-jakarta) text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Find a cause to show up for
          </h1>
          <p className="mt-3.5 text-lg leading-relaxed text-muted-foreground">
            Every event below is open to volunteers. Pick one, read the details
            and join in a single click.
          </p>
        </header>

        {/* useSearchParams inside the toolbar also needs Suspense */}
        <Suspense
          fallback={<div className="my-10 h-[52px]" aria-hidden="true" />}
        >
          <EventsToolbar types={EVENT_TYPES} />
        </Suspense>

        <Suspense fallback={<EventsSkeleton />}>
          <EventsResults searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
