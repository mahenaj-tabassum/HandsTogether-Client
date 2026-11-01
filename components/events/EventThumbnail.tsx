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
  // Remember WHICH url failed, so a corrected url gets a fresh try.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
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
      onError={() => setFailedSrc(src)}
      className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
    />
  );
}
