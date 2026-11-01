"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EventCard from "@/components/events/EventCard";
import { EVENT_TYPES } from "@/lib/event-types";
import { ApiError, createEvent } from "@/lib/api-client";
import {
  getMinEventDate,
  isHttpUrl,
  validateEventForm,
  type EventInput,
  type FieldErrors,
} from "@/lib/validate-event";
import type { EventItem } from "@/types/event";

const initialValues: EventInput = {
  title: "",
  eventType: "",
  eventDate: "",
  location: "",
  thumbnail: "",
  description: "",
};

const inputClass = "h-13 rounded-xl bg-card px-4 text-base";
const selectClass =
  "h-13 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

const tips = [
  "Pick a clear, specific title.",
  "Add the exact meeting point in the location.",
  "Use a landscape photo, it fits the card best.",
];

// One label + control + message line. The message line always keeps its height,
// so showing an error never pushes the form around.
function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 text-sm font-semibold">
        {label}
      </Label>
      {children}
      <p
        id={`${id}-msg`}
        aria-live="polite"
        className={`mt-1.5 flex min-h-5 items-start gap-1.5 text-[13px] leading-5 ${
          error ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {error ? (
          <>
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {error}
          </>
        ) : (
          hint
        )}
      </p>
    </div>
  );
}

export default function CreateEventForm() {
  const router = useRouter();
  const [values, setValues] = useState<EventInput>(initialValues);
  const [touched, setTouched] = useState<
    Partial<Record<keyof EventInput, boolean>>
  >({});
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");

  // "Tomorrow" depends on the visitor's clock, so we read it after the page loads.
  useEffect(() => {
    setMinDate(getMinEventDate());
  }, []);

  const errors = validateEventForm(values);

  // Show an error only after the field was touched or the form was submitted once.
  const errorFor = (field: keyof EventInput) =>
    serverErrors[field] ??
    (touched[field] || submitted ? errors[field] : undefined);

  function update(field: keyof EventInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setServerErrors((current) => ({ ...current, [field]: undefined }));
  }

  function fieldProps(field: keyof EventInput) {
    return {
      id: field,
      name: field,
      value: values[field],
      onChange: (
        e: ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => update(field, e.target.value),
      onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
      "aria-invalid": Boolean(errorFor(field)),
      "aria-describedby": `${field}-msg`,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await createEvent(values);
      toast.success("Event created! It is now live in Upcoming Events.");
      router.push("/events"); // ADJUST: your Upcoming Events route
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast.error("Your session expired. Please log in again.");
          router.push("/login");
          return;
        }
        if (error.fieldErrors) setServerErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Network problem. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // The preview reuses the real EventCard, so what you see is what gets published.
  const thumbnail = values.thumbnail.trim();
  const previewEvent: EventItem = {
    _id: "preview",
    title: values.title.trim() || "Your event title",
    description: values.description,
    eventType: values.eventType || "Event type",
    thumbnail: isHttpUrl(thumbnail) ? thumbnail : "",
    location: values.location.trim() || "Where will it happen?",
    eventDate: values.eventDate,
    createdAt: "",
  };

  return (
    <div className="flex flex-wrap items-start gap-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-[1.5_1_440px] flex-col gap-3 rounded-3xl border border-border bg-card p-6 sm:p-8"
      >
        <Field id="title" label="Event title" error={errorFor("title")}>
          <Input
            {...fieldProps("title")}
            type="text"
            autoComplete="off"
            placeholder="e.g. Winter Clothes Distribution"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-x-5 sm:grid-cols-2">
          <Field
            id="eventType"
            label="Event type"
            error={errorFor("eventType")}
          >
            <select {...fieldProps("eventType")} className={selectClass}>
              <option value="" disabled>
                Select a type
              </option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="eventDate"
            label="Event date"
            error={errorFor("eventDate")}
          >
            <Input
              {...fieldProps("eventDate")}
              type="date"
              min={minDate}
              className={inputClass}
            />
          </Field>
        </div>

        <Field id="location" label="Location" error={errorFor("location")}>
          <Input
            {...fieldProps("location")}
            type="text"
            autoComplete="off"
            placeholder="e.g. Mirpur 10, Dhaka"
            className={inputClass}
          />
        </Field>

        <Field
          id="thumbnail"
          label="Thumbnail image URL"
          error={errorFor("thumbnail")}
          hint="Paste a link to a landscape photo. It appears in the preview as you type."
        >
          <Input
            {...fieldProps("thumbnail")}
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://example.com/photo.jpg"
            className={inputClass}
          />
        </Field>

        <Field
          id="description"
          label="Description"
          error={errorFor("description")}
          hint="Tell people what to expect and what to bring."
        >
          <Textarea
            {...fieldProps("description")}
            rows={5}
            className="min-h-33 rounded-xl bg-card px-4 py-3.5 text-base leading-relaxed"
          />
        </Field>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="h-13 rounded-full px-7 text-base font-semibold transition-all duration-200 ease-out hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]"
          >
            {submitting ? (
              <>
                <Loader2
                  className="size-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                Creating…
              </>
            ) : (
              "Create event"
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-13 rounded-full px-7 text-base font-semibold"
          >
            <Link href="/events">Cancel</Link>
          </Button>
        </div>
      </form>

      <aside className="flex flex-[1_1_320px] flex-col gap-6">
        <div>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Live preview
          </p>
          {/* inert: the preview cannot be clicked or tabbed into, it is only a picture */}
          <div inert>
            <EventCard event={previewEvent} />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-muted p-6">
          <h2 className="mb-3.5 font-(family-name:--font-jakarta) text-lg font-bold">
            Tips for a great event
          </h2>
          <ul className="space-y-3 text-[15px] leading-normal">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2.5">
                <Check
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
