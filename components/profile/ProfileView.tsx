"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/events/EventForm";
import ProfileAvatar from "./ProfileAvatar";
import { authClient } from "@/lib/auth-client";
import { getJoinedEvents, getMyEvents } from "@/lib/api/api-client";
import { isHttpUrl } from "@/lib/validate-event";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

const inputClass = "h-13 rounded-xl bg-card px-4 text-base";

function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [touched, setTouched] = useState({ name: false, image: false });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const trimmedName = name.trim();
  const trimmedImage = image.trim();

  const errors = {
    name:
      trimmedName.length < 2
        ? "Name must be at least 2 characters."
        : trimmedName.length > 50
          ? "Name must be 50 characters or fewer."
          : undefined,
    image:
      trimmedImage && !isHttpUrl(trimmedImage)
        ? "Enter a link starting with http:// or https://."
        : undefined,
  };
  const showError = (field: "name" | "image") =>
    touched[field] || submitted ? errors[field] : undefined;

  // Only what really changed gets sent. An empty photo box means "keep my photo".
  const nameChanged = trimmedName !== user.name;
  const imageChanged =
    trimmedImage !== "" && trimmedImage !== (user.image ?? "");
  const dirty = nameChanged || imageChanged;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.image) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (!dirty) return;

    const payload: { name?: string; image?: string } = {};
    if (nameChanged) payload.name = trimmedName;
    if (imageChanged) payload.image = trimmedImage;

    setSaving(true);
    try {
      const { error } = await authClient.updateUser(payload);
      if (error) {
        toast.error(error.message ?? "Could not update your profile.");
        return;
      }
      toast.success("Profile updated.");
      router.refresh(); // refresh server-rendered parts that may show the name
    } catch {
      toast.error("Network problem. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setName(user.name);
    setImage(user.image ?? "");
    setTouched({ name: false, image: false });
    setSubmitted(false);
  }

  // The avatar previews a valid new link as you type.
  const previewSrc =
    trimmedImage && isHttpUrl(trimmedImage) ? trimmedImage : user.image;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="mb-4 flex items-center gap-5">
        <ProfileAvatar
          key={previewSrc ?? "none"}
          src={previewSrc}
          name={trimmedName || user.name}
        />
        <div className="min-w-0">
          <p className="truncate font-(family-name:--font-jakarta) text-xl font-bold">
            {user.name}
          </p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Field id="name" label="Display name" error={showError("name")}>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          autoComplete="name"
          aria-invalid={Boolean(showError("name"))}
          aria-describedby="name-msg"
          className={inputClass}
        />
      </Field>

      <Field id="email" label="Email" hint="Your email cannot be changed here.">
        <Input
          id="email"
          value={user.email}
          disabled
          readOnly
          aria-describedby="email-msg"
          className={`${inputClass} bg-muted`}
        />
      </Field>

      <Field
        id="image"
        label="Photo URL"
        error={showError("image")}
        hint="Paste a link to a square photo. Leave as it is to keep your current photo."
      >
        <Input
          id="image"
          name="image"
          type="url"
          inputMode="url"
          autoComplete="off"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, image: true }))}
          placeholder="https://example.com/me.jpg"
          aria-invalid={Boolean(showError("image"))}
          aria-describedby="image-msg"
          className={inputClass}
        />
      </Field>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={reset}
          disabled={saving || !dirty}
          className="h-13 rounded-full px-7 text-base font-semibold"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving || !dirty}
          className="h-13 rounded-full px-7 text-base font-semibold transition-all duration-200 ease-out hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]"
        >
          {saving ? (
            <>
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}

function StatTile({
  label,
  value,
  className,
}: {
  label: string;
  value: number | null;
  className: string;
}) {
  return (
    <div className={`rounded-[32px] p-6 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.08em]">
        {label}
      </p>
      <p className="mt-1 font-(family-name:--font-jakarta) text-[40px] font-extrabold leading-none">
        {value ?? "–"}
      </p>
    </div>
  );
}

export default function ProfileView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [counts, setCounts] = useState<{
    joined: number | null;
    created: number | null;
  }>({
    joined: null,
    created: null,
  });

  // Not logged in (proxy.ts should already have stopped this, this is the safety net).
  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?redirect=${encodeURIComponent("/profile")}`);
    }
  }, [isPending, session, router]);

  // The stats are a nice extra. If either call fails we show "–" and say nothing.
  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    Promise.allSettled([getJoinedEvents(), getMyEvents()]).then(
      ([joined, created]) => {
        if (cancelled) return;
        setCounts({
          joined: joined.status === "fulfilled" ? joined.value.length : null,
          created: created.status === "fulfilled" ? created.value.length : null,
        });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Profile
        </p>
        <h1 className="mt-1.5 font-(family-name:--font-jakarta) text-[28px] font-extrabold tracking-tight sm:text-[38px]">
          Your profile
        </h1>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex-[1.5_1_420px]">
          {isPending || !user ? (
            <div
              aria-busy="true"
              aria-label="Loading your profile"
              className="h-[460px] animate-pulse rounded-3xl bg-muted motion-reduce:animate-none"
            />
          ) : (
            // key = user id: a different account gets a fresh form
            <ProfileForm key={user.id} user={user} />
          )}
        </div>

        <aside className="flex flex-[1_1_260px] flex-col gap-4">
          <StatTile
            label="Events joined"
            value={counts.joined}
            className="bg-secondary text-secondary-foreground"
          />
          <StatTile
            label="Events created"
            value={counts.created}
            className="bg-accent text-accent-foreground"
          />
        </aside>
      </div>
    </>
  );
}
