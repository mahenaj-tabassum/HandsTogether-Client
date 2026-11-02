import Link from "next/link";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-[20px] bg-muted text-primary">
          <CalendarX className="size-7" aria-hidden="true" />
        </span>
        <h1 className="font-(family-name:--font-jakarta) text-[28px] font-extrabold leading-tight">
          Event not found
        </h1>
        <p className="text-muted-foreground">
          This event may have been removed, or the link is incorrect.
        </p>
        <Button
          asChild
          className="mt-2 h-[52px] rounded-full px-7 font-semibold"
        >
          <Link href="/events">Browse all events</Link>
        </Button>
      </div>
    </section>
  );
}
