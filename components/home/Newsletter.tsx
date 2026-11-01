// ADJUST: same imports/props as Features and Gallery.
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";
import NewsletterForm from "./NewsletterForm";

export default function Newsletter() {
  return (
    <section id="newsletter" className="py-20 md:py-24">
      {/* ADJUST: same wrapper classes as Features and Gallery */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[32px] border border-border bg-muted p-8 md:grid-cols-2 md:gap-12 md:p-12">
            <SectionHeading
              label="Newsletter"
              title="Never miss an event"
              description="Get new community events in your inbox, so you always know where help is needed."
            />
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
