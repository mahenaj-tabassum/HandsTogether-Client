"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError, getJoinedEvents, type JoinedEvent } from "@/lib/api-client";
import {
  sortByDate,
  splitJoinedEvents,
  type SortOrder,
  type Tab,
} from "@/lib/joined-events";
import JoinedEventRow from "./JoinedEventRow";
import JoinedEventsSkeleton from "./JoinedEventsSkeleton";
import JoinedEmptyState from "./JoinedEmptyState";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; events: JoinedEvent[] };

export default function JoinedEventsView() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0); // bump to re-run the fetch
  const [tab, setTab] = useState<Tab>("upcoming");
  // Each tab remembers its own order: soonest first for upcoming, newest first for past.
  const [order, setOrder] = useState<Record<Tab, SortOrder>>({
    upcoming: "asc",
    past: "desc",
  });

  useEffect(() => {
    let cancelled = false;
    getJoinedEvents()
      .then((events) => {
        if (!cancelled) setState({ status: "success", events });
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          router.replace(
            `/login?redirect=${encodeURIComponent("/joined-events")}`,
          );
          return;
        }
        setState({
          status: "error",
          message:
            error instanceof ApiError
              ? error.message
              : "Network problem. Check your connection and try again.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, router]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  };

  const { upcoming, past } = useMemo(
    () =>
      state.status === "success"
        ? splitJoinedEvents(state.events)
        : { upcoming: [], past: [] },
    [state],
  );
  const visible = useMemo(
    () => sortByDate(tab === "upcoming" ? upcoming : past, order[tab]),
    [tab, upcoming, past, order],
  );

  const ready = state.status === "success";
  const counts: Record<Tab, string> = {
    upcoming: ready ? String(upcoming.length) : "–",
    past: ready ? String(past.length) : "–",
  };

  // Left/Right arrows move between tabs, like the standard tabs pattern.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next: Tab = tab === "upcoming" ? "past" : "upcoming";
    setTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Joined Events
          </p>
          <h1 className="mt-1.5 font-(family-name:--font-jakarta) text-[28px] font-extrabold tracking-tight sm:text-[38px]">
            Events you have joined
          </h1>
          <p className="mt-1 text-muted-foreground">
            Switch between your upcoming and past events.
          </p>
        </div>

        <div className="w-full sm:w-56">
          <label htmlFor="sort" className="mb-1.5 block text-sm font-semibold">
            Sort by
          </label>
          <select
            id="sort"
            value={order[tab]}
            disabled={!ready}
            onChange={(e) =>
              setOrder((o) => ({ ...o, [tab]: e.target.value as SortOrder }))
            }
            className="h-12 w-full rounded-[14px] border border-input bg-card px-3.5 text-base transition-[border-color,box-shadow] duration-150 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 disabled:opacity-60"
          >
            <option value="asc">Date: soonest first</option>
            <option value="desc">Date: latest first</option>
          </select>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Joined events"
        className="mb-6 flex gap-2 border-b border-border"
      >
        {(["upcoming", "past"] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              id={`tab-${t}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls="joined-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t)}
              onKeyDown={onTabKeyDown}
              className={`-mb-px inline-flex h-12 items-center gap-2 border-b-[3px] px-4 text-base font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "upcoming" ? "Upcoming" : "Past"}
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold leading-none ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {counts[t]}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="joined-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        key={tab}
        className="motion-safe:animate-in motion-safe:fade-in-0 duration-200"
      >
        {state.status === "loading" && <JoinedEventsSkeleton />}

        {state.status === "error" && (
          <div
            role="alert"
            className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-12 text-center"
          >
            <AlertCircle
              className="size-8 text-destructive"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-(family-name:--font-jakarta) text-xl font-bold">
                We could not load your events
              </h2>
              <p className="mt-1 text-muted-foreground">{state.message}</p>
            </div>
            <Button
              onClick={retry}
              className="h-11 rounded-full px-6 font-semibold"
            >
              Try again
            </Button>
          </div>
        )}

        {ready &&
          (visible.length === 0 ? (
            <JoinedEmptyState tab={tab} />
          ) : (
            <div className="flex flex-col gap-4">
              {visible.map((event) => (
                <JoinedEventRow
                  key={event._id}
                  event={event}
                  isPast={tab === "past"}
                />
              ))}
            </div>
          ))}
      </div>
    </>
  );
}
