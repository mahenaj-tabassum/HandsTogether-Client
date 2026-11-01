import { authClient } from "@/lib/auth-client"; // ADJUST: your auth client path
import type { EventItem } from "@/types/event";
import type { EventInput, FieldErrors } from "@/lib/validate-event";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function createEvent(input: EventInput): Promise<EventItem> {
  // Ask for a fresh token on every request. Tokens expire after a short time.
  const { data, error } = await authClient.token();
  if (error || !data?.token) throw new ApiError("Please log in again.", 401);

  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      body?.message ?? "Could not create the event.",
      res.status,
      body?.errors,
    );
  }
  return body.event as EventItem;
}
