import { EVENT_TYPES } from "@/lib/event-types";

export type EventInput = {
  title: string;
  eventType: string;
  eventDate: string; // "2026-12-20", straight from <input type="date">
  location: string;
  thumbnail: string;
  description: string;
};

export type FieldErrors = Partial<Record<keyof EventInput, string>>;

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Earliest allowed date: tomorrow in the user's local time, as YYYY-MM-DD.
export function getMinEventDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-CA");
}

// The server checks the same rules again. This copy only gives instant feedback.
export function validateEventForm(values: EventInput): FieldErrors {
  const errors: FieldErrors = {};
  const title = values.title.trim();
  const location = values.location.trim();
  const thumbnail = values.thumbnail.trim();
  const description = values.description.trim();

  if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 100)
    errors.title = "Title must be 100 characters or fewer.";

  if (!(EVENT_TYPES as readonly string[]).includes(values.eventType)) {
    errors.eventType = "Choose an event type.";
  }

  if (!values.eventDate) errors.eventDate = "Pick the event date.";
  else if (values.eventDate < getMinEventDate())
    errors.eventDate = "Choose a date in the future.";

  if (location.length < 2)
    errors.location = "Enter where the event will happen.";
  else if (location.length > 120)
    errors.location = "Location must be 120 characters or fewer.";

  if (!thumbnail) errors.thumbnail = "Add a thumbnail image URL.";
  else if (!isHttpUrl(thumbnail))
    errors.thumbnail = "Enter a link starting with http:// or https://.";

  if (description.length < 20)
    errors.description = "Describe the event in at least 20 characters.";
  else if (description.length > 1000)
    errors.description = "Description must be 1000 characters or fewer.";

  return errors;
}
