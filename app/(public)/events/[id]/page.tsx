import type { Metadata } from "next";
import EventDetailsComponent from "@/components/events/EventDetailsComponent"; // ADJUST path

export const metadata: Metadata = { title: "Event Details" };

// Same rule as /events: do not await params here, pass the Promise down
// and await it inside a Suspense boundary (Cache Components).
export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EventDetailsComponent params={params} />;
}
