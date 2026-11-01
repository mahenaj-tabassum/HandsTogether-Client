import HeroIllustration from "@/components/home/HeroIllustration";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO(replace): dummy data. Later, load the volunteer count from the backend stats API.
const HERO_STAT = { value: "1,200+", label: "Volunteers joined" };

// TODO(replace): dummy data. Later, use the nearest upcoming event from the events API.
const NEXT_EVENT = { title: "Tree Plantation Drive", date: "Dec 14, 2026" };

// Small helper so each block enters one after another (stagger).
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-300 px-4 pt-12 sm:px-8 lg:pt-18">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* ---------- Left: text ---------- */}
        <div className="text-center sm:text-left">
          <span
            className="animate-fade-up inline-block text-[13px] font-semibold uppercase tracking-[0.08em] text-primary"
            style={delay(0)}
          >
            Social development, together
          </span>

          <h1
            className="animate-fade-up mb-5 mt-4 font-heading text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
            style={delay(80)}
          >
            <span className="block">Small hands.</span>
            <span className="block">Big change.</span>
          </h1>

          <p
            className="animate-fade-up mx-auto sm:mx-0 mb-8 max-w-120 text-[17px] leading-[1.65] text-muted-foreground sm:text-lg"
            style={delay(160)}
          >
            Find community events near you, create your own, and join volunteers
            planting trees, sharing food and cleaning up neighborhoods.
          </p>

          <div
            className="animate-fade-up flex flex-wrap gap-3"
            style={delay(240)}
          >
            {/* TODO(replace): make sure these routes match your app */}
            <Button
              asChild
              className="group h-14 w-full sm:w-auto rounded-full px-7 text-base font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              <Link href="/events">
                Explore Events
                <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full w-full sm:w-auto  border-[1.5px] border-foreground bg-transparent px-7 text-base font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              <Link href="/create-event">Create an Event</Link>
            </Button>
          </div>
        </div>

        {/* ---------- Right: bento ---------- */}
        <div
          className="animate-fade-up grid grid-cols-1 gap-4 sm:grid-cols-[1.2fr_1fr] sm:grid-rows-[minmax(170px,auto)_minmax(170px,auto)_110px]"
          style={delay(200)}
        >
          {/* Tile 1: hero photo */}
          <div className="group relative hidden row-span-2 overflow-hidden rounded-tile border border-border bg-muted md:grid">
            <HeroIllustration className="absolute inset-0 h-full w-full transition-transform duration-300 ease-out group-hover:scale-105" />
          </div>

          {/* Tile 2: stat */}
          <div className="flex flex-col justify-end rounded-xl sm:rounded-tile bg-secondary p-5 text-secondary-foreground sm:p-6">
            <p className="font-heading text-[32px] font-extrabold leading-none sm:text-[40px]">
              {HERO_STAT.value}
            </p>
            <p className="mt-1.5 text-[15px] font-medium">{HERO_STAT.label}</p>
          </div>

          {/* Tile 3: Next up */}
          <div className="flex flex-col justify-end rounded-xl sm:rounded-tile bg-accent p-5 text-accent-foreground sm:p-6">
            <span className="text-xs font-semibold uppercase tracking-[0.08em]">
              Next up
            </span>
            <p className="mt-1.5 font-heading text-[19px] font-bold leading-tight">
              {NEXT_EVENT.title}
            </p>
            <p className="mt-1 text-sm font-medium">{NEXT_EVENT.date}</p>
          </div>

          {/* Tile 4: call to action */}
          <Link
            href="/events"
            className="group col-span-1 hidden sm:flex items-center justify-between rounded-tile border border-border bg-card px-6 text-card-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:col-span-2 sm:px-7"
          >
            <span className="font-heading text-lg font-bold leading-tight sm:text-[21px]">
              Join a cause near you
            </span>
            <ArrowRight
              className="size-5.5 text-primary transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
