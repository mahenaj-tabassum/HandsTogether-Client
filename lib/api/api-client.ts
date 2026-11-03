import { authClient } from "@/lib/auth-client"; // ADJUST: your auth client path
import type { EventItem } from "@/types/event";
import type { EventInput, FieldErrors } from "@/lib/validate-event";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://hands-together-server.vercel.app";

export type JoinedEvent = EventItem & { joinedAt: string };

export class ApiError extends Error {
  status: number;
  fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// One place that talks to the server for every login-protected request.
// Ask for a fresh token each time, because tokens expire after a short time.
async function authedRequest(
  path: string,
  init: { method: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown },
  fallbackMessage: string,
) {
  const { data, error } = await authClient.token();
  if (error || !data?.token) throw new ApiError("Please log in again.", 401);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${data.token}`,
  };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${path}`, {
    method: init.method,
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      body?.message ?? fallbackMessage,
      res.status,
      body?.errors,
    );
  }
  return body;
}

export async function createEvent(input: EventInput): Promise<EventItem> {
  const body = await authedRequest(
    "/api/events",
    { method: "POST", body: input },
    "Could not create the event.",
  );
  return body.event as EventItem;
}

// POST /api/events/:id/join  ->  new seat numbers
export async function joinEvent(
  eventId: string,
): Promise<{ joinedCount: number; capacity: number }> {
  const body = await authedRequest(
    `/api/events/${encodeURIComponent(eventId)}/join`,
    { method: "POST" },
    "Could not join the event.",
  );
  return { joinedCount: body.joinedCount, capacity: body.capacity };
}

// GET /api/events/:id/join  ->  has the logged-in user already joined?
export async function getJoinStatus(eventId: string): Promise<boolean> {
  const body = await authedRequest(
    `/api/events/${encodeURIComponent(eventId)}/join`,
    { method: "GET" },
    "Could not check your join status.",
  );
  return body.joined === true;
}

// GET /api/events/joined  ->  used by the Joined Events page (next step)
export async function getJoinedEvents(): Promise<JoinedEvent[]> {
  const body = await authedRequest(
    "/api/events/joined",
    { method: "GET" },
    "Could not load your joined events.",
  );
  return body.events as JoinedEvent[];
}

// GET /api/events/mine  ->  events created by the logged-in user
export async function getMyEvents(): Promise<EventItem[]> {
  const body = await authedRequest(
    "/api/events/mine",
    { method: "GET" },
    "Could not load your events.",
  );
  return body.events as EventItem[];
}

// PATCH /api/events/:id  ->  the updated event
export async function updateEvent(
  eventId: string,
  input: EventInput,
): Promise<EventItem> {
  const body = await authedRequest(
    `/api/events/${encodeURIComponent(eventId)}`,
    { method: "PATCH", body: input },
    "Could not update the event.",
  );
  return body.event as EventItem;
}

// DELETE /api/events/:id
export async function deleteEvent(eventId: string): Promise<void> {
  await authedRequest(
    `/api/events/${encodeURIComponent(eventId)}`,
    { method: "DELETE" },
    "Could not delete the event.",
  );
}
