"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EventsToolbar({ types }: { types: readonly string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeType = searchParams.get("type") ?? "";
  const urlQ = searchParams.get("q") ?? "";

  const [value, setValue] = useState(urlQ);
  const lastPushed = useRef(urlQ); // the q we last wrote into the URL

  // Change one URL parameter and keep the others (type stays when q changes).
  const updateParam = useCallback(
    (key: "type" | "q", next: string) => {
      const params = new URLSearchParams(window.location.search);
      if (next) params.set(key, next);
      else params.delete(key);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname],
  );

  // URL changed from outside (Clear filters link, Back button): update the input.
  useEffect(() => {
    if (urlQ !== lastPushed.current) {
      lastPushed.current = urlQ;
      setValue(urlQ);
    }
  }, [urlQ]);

  // Debounce: wait 300ms after the last keystroke, then update the URL.
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === lastPushed.current) return;
    const timer = setTimeout(() => {
      lastPushed.current = trimmed;
      updateParam("q", trimmed);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, updateParam]);

  const chipBase =
    "inline-flex h-11 items-center rounded-full border px-[18px] text-sm font-semibold transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div className="my-10 flex flex-wrap items-center justify-between gap-4">
      <div
        role="group"
        aria-label="Filter by event type"
        className="flex flex-wrap gap-2.5"
      >
        {["All", ...types].map((label) => {
          const next = label === "All" ? "" : label;
          const active = next === activeType;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => updateParam("type", next)}
              className={`${chipBase} ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:max-w-[340px] sm:flex-1">
        <label htmlFor="event-search" className="sr-only">
          Search events
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="event-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by title or location"
          maxLength={100}
          className="h-[52px] rounded-full pl-11 pr-11 text-base"
        />
        {isPending && (
          <Loader2
            className="absolute right-4 top-1/2 size-[18px] -translate-y-1/2 animate-spin text-muted-foreground motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
