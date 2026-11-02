import { EventItem } from "../../types/event";

type EventsResponse = { success: boolean; count: number; events: EventItem[] };
export type EventFilters = { limit?: number; type?: string; q?: string };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Upcoming events with optional filters. Empty filters are simply left out of the URL.
export const getEvents = async (
  filters: EventFilters = {},
): Promise<EventItem[]> => {
  // URLSearchParams escapes special characters (&, #, spaces) for us.
  const params = new URLSearchParams();
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.type) params.set("type", filters.type);
  if (filters.q) params.set("q", filters.q);
  const query = params.toString();

  const response = await fetch(
    `${API_URL}/api/events${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Failed to load events (${response.status})`);
  }
  const data: EventsResponse = await response.json();
  return data.events;
};

// Homepage still calls this, nothing to change there.
export const getUpcomingEvents = (limit?: number): Promise<EventItem[]> =>
  getEvents({ limit });

// One event. Returns null when it does not exist (404) or the id is malformed (400).
export const getEventById = async (id: string): Promise<EventItem | null> => {
  const response = await fetch(
    `${API_URL}/api/events/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) {
    throw new Error(`Failed to load event (${response.status})`);
  }
  const data: { success: boolean; event: EventItem } = await response.json();
  return data.event;
};
