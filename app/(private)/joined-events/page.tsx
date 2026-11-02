// app/joined-events/page.tsx  (server component)
import type { Metadata } from "next";
import JoinedEventsView from "@/components/joined/JoinedEventsView";

export const metadata: Metadata = { title: "Joined Events" };

export default function JoinedEventsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 pb-16 pt-12">
      <JoinedEventsView />
    </main>
  );
}
