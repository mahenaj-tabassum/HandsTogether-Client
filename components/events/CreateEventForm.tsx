"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/EventCard";
import EventForm from "@/components/events/EventForm";
import { createEvent } from "@/lib/api/api-client";
import { isHttpUrl, type EventInput } from "@/lib/validate-event";
import type { EventItem } from "@/types/event";

const initialValues: EventInput = {
  title: "",
  eventType: "",
  eventDate: "",
  eventTime: "",
  location: "",
  thumbnail: "",
  description: "",
  capacity: "",
};

const tips = [
  "Pick a clear, specific title.",
  "Add the exact meeting point in the location.",
  "Use a landscape photo, it fits the card best.",
];

export default function CreateEventForm() {
  const router = useRouter();
  const [values, setValues] = useState<EventInput>(initialValues);

  const thumbnail = values.thumbnail.trim();
  const previewEvent: EventItem = {
    _id: "preview",
    title: values.title.trim() || "Your event title",
    description: values.description,
    eventType: values.eventType || "Event type",
    thumbnail: isHttpUrl(thumbnail) ? thumbnail : "",
    location: values.location.trim() || "Where will it happen?",
    eventDate: values.eventDate,
    eventTime: values.eventTime,
    capacity: Number(values.capacity) || 0,
    joinedCount: 0,
    createdAt: "",
  };

  return (
    <div className="flex flex-wrap items-start gap-8">
      <EventForm
        initialValues={initialValues}
        submitLabel="Create event"
        submittingLabel="Creating…"
        onValuesChange={setValues}
        className="flex-[1.5_1_440px] rounded-3xl border border-border bg-card p-6 sm:p-8"
        cancel={
          <Button
            asChild
            variant="outline"
            className="h-13 rounded-full px-7 text-base font-semibold"
          >
            <Link href="/events">Cancel</Link>
          </Button>
        }
        onSubmit={async (formValues) => {
          await createEvent(formValues);
          toast.success("Event created! It is now live in Upcoming Events.");
          router.push("/events"); // ADJUST: your Upcoming Events route
        }}
      />

      <aside className="flex flex-[1_1_320px] flex-col gap-6">
        <div>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Live preview
          </p>
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
