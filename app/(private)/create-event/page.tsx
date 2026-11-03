import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CreateEventForm from "@/components/events/CreateEventForm";
import CreateEventSkeleton from "@/components/events/Create_EventSkeleton";

export const metadata: Metadata = { title: "Create Event" };

// The request-time work (reading the login cookie) lives here, inside Suspense.
async function CreateEventGuard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    redirect(`/login?redirect=${encodeURIComponent("/create-event")}`);

  return <CreateEventForm />;
}

export default function CreateEventPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-10 max-w-xl">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
            Create event
          </span>
          <h1 className="mt-2.5 mb-3 font-heading text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
            Organize something good
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Share the details so neighbors can find your event, join it and show
            up.
          </p>
        </header>

        <Suspense fallback={<CreateEventSkeleton />}>
          <CreateEventGuard />
        </Suspense>
      </div>
    </section>
  );
}
