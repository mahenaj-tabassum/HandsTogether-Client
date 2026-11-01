// ADJUST: import paths and props are still my guess. Match them to your Features file.
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";
import GalleryTile from "./GalleryTile";
import { galleryItems, type GalleryItem } from "@/lib/gallery";

// Full class names are written out so Tailwind can detect them.
const spans: Record<GalleryItem["size"], string> = {
  large: "col-span-2 row-span-2",
  wide: "col-span-2",
  small: "",
};

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 md:py-24">
      {/* ADJUST: use the same wrapper classes as Features */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          label="Community gallery"
          title="Moments from our community"
          description="Small acts of kindness, shared by volunteers like you."
        />

        <ul className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] sm:grid-cols-3 lg:auto-rows-[190px] lg:grid-cols-4">
          {galleryItems.map((item, index) => (
            <li key={item.id} className={`${spans[item.size]} [&>div]:h-full`}>
              <Reveal delay={index * 80}>
                <GalleryTile item={item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
