import { EVENT_TYPES } from "@/lib/event-types";
import type { EventItem } from "@/types/event";

export type EventInput = {
  title: string;
  eventType: string;
  eventDate: string; // "2026-12-20", straight from <input type="date">
  eventTime: string; // "09:30", straight from <input type="time">
  location: string;
  thumbnail: string;
  description: string;
  capacity: string; // Kept as text because that is what an <input> gives us.
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
export function validateEventForm(
  values: EventInput,
  originalDate?: string,
): FieldErrors {
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

  if (!values.eventDate) {
    errors.eventDate = "Pick the event date.";
  } else if (
    values.eventDate < getMinEventDate() &&
    values.eventDate !== originalDate
  ) {
    errors.eventDate = "Choose a date in the future.";
  }

  // Same pattern as the server: 00:00 to 23:59
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.eventTime)) {
    errors.eventTime = "Pick the start time.";
  }

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

  // Number("") is 0, so an empty box fails the "at least 1" check too.
  const capacity = Number(values.capacity);

  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 5000) {
    errors.capacity = "Enter a whole number between 1 and 5000.";
  }

  return errors;
}

// Turns a saved event into the text-only shape the form works with.
export function eventToInput(event: EventItem): EventInput {
  return {
    title: event.title,
    eventType: event.eventType,
    eventDate: event.eventDate.slice(0, 10),
    eventTime: event.eventTime,
    location: event.location,
    thumbnail: event.thumbnail,
    description: event.description,
    capacity: String(event.capacity),
  };
}
