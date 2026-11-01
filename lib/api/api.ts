import { EventItem } from "../../types/event";

type EventsResponse = { success: boolean; count: number; events: EventItem[] };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Upcoming events, soonest first. Pass a limit to get only the first few.
export const getUpcomingEvents = async (
  limit?: number,
): Promise<EventItem[]> => {
  const query = limit ? `?limit=${limit}` : "";
  const response = await fetch(`${API_URL}/api/events${query}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to load events (${response.status})`);
  }
  const data: EventsResponse = await response.json();
  return data.events;
};
