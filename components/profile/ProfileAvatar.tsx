"use client";

import { useState } from "react";

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
}

// Shows the photo, or the initials if there is no photo or the link is broken.
// Tip for the caller: pass key={src}, so a new link gets a fresh "not failed" state.
export default function ProfileAvatar({
  src,
  name,
  className = "size-22",
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-(family-name:--font-jakarta) text-2xl font-extrabold text-foreground ${className}`}
    >
      {src && !failed ? (
        // A plain <img>: next/image would need every photo host listed in next.config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Profile photo of ${name}`}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </div>
  );
}
