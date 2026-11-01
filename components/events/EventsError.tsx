import { TriangleAlert } from "lucide-react";
import RetryButton from "./RetryButton";

export default function EventsError() {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-3xl border border-border px-6 py-16 text-center"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-destructive">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </div>
      <h3 className="font-(family-name:--font-jakarta) text-xl font-bold">
        We couldn&apos;t load events
      </h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Something went wrong while reaching the server. Please try again in a
        moment.
      </p>
      <RetryButton />
    </div>
  );
}
