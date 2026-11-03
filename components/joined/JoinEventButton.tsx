"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ApiError, getJoinStatus, joinEvent } from "@/lib/api/api-client";

export default function JoinEventButton({
  eventId,
  hasEnded,
  isFull,
}: {
  eventId: string;
  hasEnded: boolean;
  isFull: boolean;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  // null = we have not heard back from the server yet
  const [joinedState, setJoinedState] = useState<boolean | null>(null);
  const [joining, setJoining] = useState(false);

  // When a user is logged in, ask the server whether they already joined this event.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getJoinStatus(eventId)
      .then((value) => {
        if (!cancelled) setJoinedState(value);
      })
      .catch(() => {
        if (!cancelled) setJoinedState(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, eventId]);

  const joined = userId ? joinedState === true : false;
  // Wait for both answers, so the button never flashes "Join Event" and then "Joined".
  const checking = isPending || (Boolean(userId) && joinedState === null);

  const goToLogin = () =>
    router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`);

  const handleJoin = async () => {
    if (!userId) {
      goToLogin();
      return;
    }

    setJoining(true);
    try {
      await joinEvent(eventId);
      setJoinedState(true);
      toast.success("You joined this event!");
      router.refresh(); // ask the server to re-render the page, so "spots left" updates
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast.error("Your session expired. Please log in again.");
          goToLogin();
          return;
        }
        if (error.status === 409) {
          // Either "already joined" or "event is full". Refresh so the page shows the truth.
          if (/already/i.test(error.message)) setJoinedState(true);
          toast.error(error.message);
          router.refresh();
          return;
        }
        toast.error(error.message);
      } else {
        toast.error("Network problem. Check your connection and try again.");
      }
    } finally {
      setJoining(false);
    }
  };

  const disabled = checking || joining || joined || hasEnded || isFull;

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        onClick={handleJoin}
        disabled={disabled}
        className="h-[52px] w-full rounded-full text-base font-semibold transition-all duration-200 ease-out hover:shadow-md motion-safe:active:scale-[0.98]"
      >
        {checking ? (
          <Loader2
            className="size-5 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        ) : joining ? (
          <>
            <Loader2
              className="size-5 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
            Joining…
          </>
        ) : joined ? (
          <>
            <Check className="size-5" aria-hidden="true" />
            You have joined
          </>
        ) : hasEnded ? (
          "Event has ended"
        ) : isFull ? (
          "Event is full"
        ) : (
          "Join Event"
        )}
      </Button>

      {!hasEnded && !isFull && !checking && !session && (
        <p className="flex items-start gap-2 text-sm leading-normal text-muted-foreground">
          <Lock className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
          You need to log in first. We will bring you back to this event
          afterwards.
        </p>
      )}
    </div>
  );
}
