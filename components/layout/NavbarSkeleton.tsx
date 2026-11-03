import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";

// Same wrapper, height and spacing as <Navbar />, so nothing jumps when the real one arrives.
// Logo and ThemeToggle are real (they need no pathname or session), the rest are placeholders.
export function NavbarSkeleton() {
  return (
    <header className="pointer-events-none sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Main"
        className="pointer-events-auto mx-auto flex h-15 max-w-300 items-center justify-between rounded-full border border-border bg-card/90 pl-5 pr-6 backdrop-blur"
      >
        <Logo />

        {/* Placeholder for "Home" and "Upcoming Events" (desktop only, like the real links) */}
        <div className="hidden items-center gap-8 md:flex" aria-hidden="true">
          <Skeleton className="h-4 w-12 rounded-full motion-reduce:animate-none" />
          <Skeleton className="h-4 w-28 rounded-full motion-reduce:animate-none" />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Desktop: profile picture / Login slot. Mobile: menu button slot. */}
          <Skeleton
            className="hidden size-11 rounded-full motion-reduce:animate-none md:block"
            aria-hidden="true"
          />
          <Skeleton
            className="size-11 rounded-full motion-reduce:animate-none md:hidden"
            aria-hidden="true"
          />
        </div>
      </nav>
    </header>
  );
}
