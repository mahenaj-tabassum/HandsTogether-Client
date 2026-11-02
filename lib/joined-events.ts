import type { JoinedEvent } from "@/lib/api-client";

export type Tab = "upcoming" | "past";
export type SortOrder = "asc" | "desc";

// Same rule as the backend: "today" starts at 00:00 UTC.
export function splitJoinedEvents(events: JoinedEvent[]) {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const upcoming: JoinedEvent[] = [];
  const past: JoinedEvent[] = [];
  for (const event of events) {
    (new Date(event.eventDate) >= startOfToday ? upcoming : past).push(event);
  }
  return { upcoming, past };
}

// Sort by date, then by time ("HH:mm" strings compare correctly as text).
export function sortByDate(events: JoinedEvent[], order: SortOrder) {
  const sorted = [...events].sort((a, b) => {
    const byDate =
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    return byDate !== 0
      ? byDate
      : (a.eventTime ?? "").localeCompare(b.eventTime ?? "");
  });
  return order === "asc" ? sorted : sorted.reverse();
}
export function hasEnded(eventDate: string) {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  return new Date(eventDate) < startOfToday;
}
