import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";

// Chips sit on top of a photo, so they use fixed light tints in both themes.
// The text label always carries the meaning, color is only a hint.
const chipStyles: Record<GalleryItem["type"], string> = {
  Plantation: "bg-green-100 text-green-800",
  Cleanup: "bg-blue-100 text-blue-800",
  Donation: "bg-amber-100 text-amber-900",
  Education: "bg-violet-100 text-violet-800",
  Health: "bg-rose-100 text-rose-800",
};

// Tells the browser how wide each tile really is, so it downloads the right file size.
const largeSizes =
  "(min-width: 1152px) 568px, (min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw";
const smallSizes =
  "(min-width: 1152px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

const imageSizes: Record<GalleryItem["size"], string> = {
  large: largeSizes,
  wide: largeSizes,
  small: smallSizes,
};

export default function GalleryTile({ item }: { item: GalleryItem }) {
  return (
    <figure className="group relative h-full w-full overflow-hidden rounded-3xl border border-border bg-muted transition-colors duration-300 ease-out hover:border-primary/40">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={imageSizes[item.size]}
        style={{ objectPosition: item.position }}
        className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
      />

      <figcaption className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 bg-linear-to-t from-[#0E0F14]/85 via-[#0E0F14]/45 to-transparent p-4 pt-12 text-white transition-opacity duration-[250ms] ease-out motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${chipStyles[item.type]}`}
        >
          {item.type}
        </span>
        <p
          className={`font-medium leading-snug ${
            item.size === "large" ? "text-base" : "text-sm"
          }`}
        >
          {item.title} · {item.location}
        </p>
      </figcaption>
    </figure>
  );
}
