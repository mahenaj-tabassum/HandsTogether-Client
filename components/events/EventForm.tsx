"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPES } from "@/lib/event-types";
import { ApiError } from "@/lib/api/api-client";
import {
  getMinEventDate,
  validateEventForm,
  type EventInput,
  type FieldErrors,
} from "@/lib/validate-event";

const inputClass = "h-13 rounded-xl bg-card px-4 text-base";
const selectClass =
  "h-13 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function Field({
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

type EventFormProps = {
  initialValues: EventInput;
  /** Set when editing: this old date is allowed even if it is in the past. */
  originalDate?: string;
  submitLabel: string;
  submittingLabel: string;
  /** Do the API call here. Throw (ApiError) on failure; the form shows the message. */
  onSubmit: (values: EventInput) => Promise<void>;
  /** Lets a parent (the live preview) see every change. */
  onValuesChange?: (values: EventInput) => void;
  /** The Cancel button or link, so each page decides what Cancel does. */
  cancel: ReactNode;
  className?: string;
};

export default function EventForm({
  initialValues,
  originalDate,
  submitLabel,
  submittingLabel,
  onSubmit,
  onValuesChange,
  cancel,
  className = "",
}: EventFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<EventInput>(initialValues);
  const [touched, setTouched] = useState<
    Partial<Record<keyof EventInput, boolean>>
  >({});
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(getMinEventDate());
  }, []);

  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);

  const errors = validateEventForm(values, originalDate);

  // While editing an old event, let the date picker start at the old date.
  const dateMin =
    originalDate && minDate && originalDate < minDate ? originalDate : minDate;

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
      await onSubmit(values);
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

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`flex flex-col gap-3 ${className}`}
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
        <Field id="eventType" label="Event type" error={errorFor("eventType")}>
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

        <Field id="eventDate" label="Event date" error={errorFor("eventDate")}>
          <Input
            {...fieldProps("eventDate")}
            type="date"
            min={dateMin}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field id="eventTime" label="Start time" error={errorFor("eventTime")}>
          <Input
            {...fieldProps("eventTime")}
            type="time"
            className={inputClass}
          />
        </Field>

        <Field
          id="capacity"
          label="Capacity"
          error={errorFor("capacity")}
          hint="How many volunteers can join."
        >
          <Input
            {...fieldProps("capacity")}
            type="number"
            inputMode="numeric"
            min={1}
            max={5000}
            step={1}
            placeholder="e.g. 30"
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
        hint="Paste a link to a landscape photo."
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
              {submittingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {cancel}
      </div>
    </form>
  );
}
