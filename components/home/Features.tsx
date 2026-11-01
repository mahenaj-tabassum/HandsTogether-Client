import { CalendarPlus, Heart, ListChecks, Search } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";

// Static content (not dummy data), so it can stay in this file.
const FEATURES = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Browse upcoming events in your area and find a cause you care about.",
  },
  {
    icon: CalendarPlus,
    title: "Create",
    description:
      "Start your own community event and invite people to join you.",
  },
  {
    icon: Heart,
    title: "Join",
    description:
      "Sign up as a volunteer with one click and show up where it counts.",
  },
  {
    icon: ListChecks,
    title: "Track",
    description: "See every event you joined in one tidy list, anytime.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pt-24 sm:px-8">
      <Reveal>
        <SectionHeading
          label="Platform features"
          title="Everything you need to make a difference"
          description="From finding an event to tracking your impact, all in one place."
          className="mb-10"
        />
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 80} className="h-full">
            <article className="group h-full rounded-3xl border border-border bg-card p-7 text-card-foreground transition-colors duration-200 ease-out hover:border-primary/40">
              <div className="mb-5 flex size-12 items-center justify-center rounded-[14px] bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-[19px] font-bold leading-[1.25] sm:text-[21px]">
                {title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-muted-foreground">
                {description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
