import { getEvents } from "@/lib/api/api";
import type { EventItem } from "@/types/event";
import EventCard from "./EventCard";
import EventsError from "./EventsError";
import EventsNoResults from "./EventsNoResults";

export type SearchParams = Record<string, string | string[] | undefined>;

// ?type=a&type=b gives an array, so take the first value.
const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export default async function EventsResults({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const type = first(params.type).trim();
  const q = first(params.q).trim();

  let events: EventItem[];
  try {
    events = await getEvents({ type, q });
  } catch {
    return <EventsError />;
  }

  if (events.length === 0)
    return <EventsNoResults hasFilters={Boolean(type || q)} />;

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        Showing {events.length} upcoming{" "}
        {events.length === 1 ? "event" : "events"}
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event._id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </>
  );
}
