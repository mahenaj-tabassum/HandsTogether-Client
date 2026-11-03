"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AlertCircle, CalendarPlus, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from "@/components/events/EventForm";
import JoinedEventsSkeleton from "@/components/joined/JoinedEventsSkeleton";
import ManageEventRow from "./ManageEventRow";
import {
  ApiError,
  deleteEvent,
  getMyEvents,
  updateEvent,
} from "@/lib/api/api-client";
import { eventToInput } from "@/lib/validate-event";
import type { EventItem } from "@/types/event";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; events: EventItem[] };

const byDate = (a: EventItem, b: EventItem) =>
  new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime() ||
  (a.eventTime ?? "").localeCompare(b.eventTime ?? "");

export default function ManageEventsView() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const goToLogin = () =>
    router.replace(`/login?redirect=${encodeURIComponent("/manage-events")}`); // ADJUST: your route

  useEffect(() => {
    let cancelled = false;
    getMyEvents()
      .then((events) => {
        if (!cancelled)
          setState({ status: "success", events: [...events].sort(byDate) });
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          goToLogin();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  };

  const removeFromList = (id: string) =>
    setState((s) =>
      s.status === "success"
        ? { status: "success", events: s.events.filter((e) => e._id !== id) }
        : s,
    );

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteEvent(deleting._id);
      removeFromList(deleting._id);
      toast.success("Event deleted.");
      setDeleting(null);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast.error("Your session expired. Please log in again.");
          goToLogin();
          return;
        }
        if (error.status === 404) {
          // Already gone (maybe deleted in another tab). The list should match reality.
          removeFromList(deleting._id);
          setDeleting(null);
          toast.info("That event was already deleted.");
          return;
        }
        toast.error(error.message);
      } else {
        toast.error("Network problem. Check your connection and try again.");
      }
    } finally {
      setDeleteBusy(false);
    }
  }

  const joinedWarning = deleting?.joinedCount
    ? ` and its ${deleting.joinedCount} joined ${deleting.joinedCount === 1 ? "volunteer" : "volunteers"} will be removed`
    : " will be removed";

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Manage Events
          </p>
          <h1 className="mt-1.5 font-(family-name:--font-jakarta) text-[28px] font-extrabold tracking-tight sm:text-[38px]">
            Your events
          </h1>
          <p className="mt-1 text-muted-foreground">
            Update details or remove events you created.
          </p>
        </div>
        <Button asChild className="h-11 rounded-full px-6 font-semibold">
          <Link href="/create-event">
            <Plus className="size-4" aria-hidden="true" />
            Create Event
          </Link>
        </Button>
      </div>

      {state.status === "loading" && <JoinedEventsSkeleton />}

      {state.status === "error" && (
        <div
          role="alert"
          className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-12 text-center"
        >
          <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
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

      {state.status === "success" &&
        (state.events.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card px-6 py-14 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-[20px] bg-muted">
              <CalendarPlus className="size-7" aria-hidden="true" />
            </div>
            <h2 className="font-(family-name:--font-jakarta) text-2xl font-extrabold">
              You have not created any events yet
            </h2>
            <p className="mx-auto mt-2.5 max-w-md leading-relaxed text-muted-foreground">
              Start a community event and invite people to join you.
            </p>
            <Button
              asChild
              className="mt-6 h-[52px] rounded-full px-7 font-semibold"
            >
              <Link href="/create-event">Create your first event</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 motion-safe:animate-in motion-safe:fade-in-0 duration-200">
            {state.events.map((event) => (
              <ManageEventRow
                key={event._id}
                event={event}
                onEdit={() => setEditing(event)}
                onDelete={() => setDeleting(event)}
              />
            ))}
          </div>
        ))}

      {/* Update form */}
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:max-w-[680px] sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-(family-name:--font-jakarta) text-[28px] font-extrabold">
              Update event
            </DialogTitle>
            <DialogDescription>
              Change anything below. Volunteers who already joined stay joined.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <EventForm
              key={editing._id}
              initialValues={eventToInput(editing)}
              originalDate={editing.eventDate.slice(0, 10)}
              submitLabel="Save changes"
              submittingLabel="Saving…"
              cancel={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                  className="h-13 rounded-full px-7 text-base font-semibold"
                >
                  Cancel
                </Button>
              }
              onSubmit={async (values) => {
                const updated = await updateEvent(editing._id, values);
                setState((s) =>
                  s.status === "success"
                    ? {
                        status: "success",
                        events: s.events
                          .map((e) =>
                            e._id === updated._id ? { ...e, ...updated } : e,
                          )
                          .sort(byDate),
                      }
                    : s,
                );
                toast.success("Event updated.");
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open && !deleteBusy) setDeleting(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl p-7">
          <AlertDialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-[14px] bg-destructive/10 text-destructive">
              <AlertCircle className="size-5" aria-hidden="true" />
            </div>
            <AlertDialogTitle className="font-(family-name:--font-jakarta) text-[22px] font-extrabold">
              Delete this event?
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              &ldquo;{deleting?.title}&rdquo;{joinedWarning}. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteBusy}
              className="h-11 rounded-full px-6 font-semibold"
            >
              Keep event
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteBusy}
              onClick={(e) => {
                e.preventDefault(); // keep the dialog open until the request finishes
                void confirmDelete();
              }}
              className="h-11 rounded-full bg-destructive px-6 font-semibold text-white hover:bg-destructive/90"
            >
              {deleteBusy ? (
                <>
                  <Loader2
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Deleting…
                </>
              ) : (
                "Yes, delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
