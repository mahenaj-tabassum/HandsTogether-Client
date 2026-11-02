import type { Metadata } from "next";
import EventsPageComponent from "@/components/events/EventsPageComponent"; // ADJUST path

export const metadata: Metadata = { title: "Upcoming Events" };

// Do NOT await searchParams here. Reading it is request-time data,
// so we pass the Promise down and await it inside a Suspense boundary.
export default function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <EventsPageComponent searchParams={searchParams} />;
}
