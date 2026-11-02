import type { Metadata } from "next";
import ManageEventsView from "@/components/manage/ManageEventsView";

export const metadata: Metadata = { title: "Manage Events" };

export default function ManageEventsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 pb-16 pt-12">
      <ManageEventsView />
    </main>
  );
}
