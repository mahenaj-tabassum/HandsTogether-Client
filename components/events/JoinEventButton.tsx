"use client";

import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"; // ADJUST: your BetterAuth client file

export default function JoinEventButton({
  eventId,
  hasEnded,
}: {
  eventId: string;
  hasEnded: boolean;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleJoin = () => {
    if (!session) {
      // ADJUST: use whatever your Login page reads to return the user afterwards.
      router.push(
        `/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`,
      );
      return;
    }
    // TODO next step: call POST /api/events/:id/join here.
    toast.info("Joining will be connected in the next step.");
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        onClick={handleJoin}
        disabled={hasEnded || isPending}
        className="h-[52px] w-full rounded-full text-base font-semibold transition-all duration-200 ease-out hover:shadow-md"
      >
        {isPending ? (
          <Loader2
            className="size-5 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        ) : hasEnded ? (
          "Event has ended"
        ) : (
          "Join Event"
        )}
      </Button>

      {!hasEnded && !isPending && !session && (
        <p className="flex items-start gap-2 text-sm leading-normal text-muted-foreground">
          <Lock className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
          You need to log in first. We will bring you back to this event
          afterwards.
        </p>
      )}
    </div>
  );
}
