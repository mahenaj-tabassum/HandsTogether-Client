"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartHandshake } from "lucide-react";

export default function EventThumbnail({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  // Missing or broken URL: show a calm placeholder instead of a broken image icon.
  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <HeartHandshake className="size-9" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
    />
  );
}
