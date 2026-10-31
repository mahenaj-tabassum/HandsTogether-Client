"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isPending } = useCurrentUser();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Invisible marker at the top of the page: when it scrolls out of view, the navbar gets its shadow */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="absolute top-0 h-px w-full"
      />

      <header className="pointer-events-none sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Main"
          className={cn(
            "pointer-events-auto mx-auto flex h-15 max-w-300 items-center justify-between rounded-full border border-border bg-card/90 pl-5 pr-6 backdrop-blur transition-shadow duration-200 ease-out",
            scrolled ? "shadow-lg" : "shadow-none",
          )}
        >
          <Logo />

          <NavLinks className="hidden md:flex" />

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <ThemeToggle />
            </div>

            {isPending ? (
              <div className="hidden size-11 animate-pulse rounded-full bg-muted md:block" />
            ) : user ? (
              <div className="hidden items-center md:flex">
                <UserMenu user={user} />
              </div>
            ) : (
              <Button
                asChild
                className="hidden h-11 rounded-full px-6 font-semibold md:inline-flex"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}

            <MobileMenu user={user} />
          </div>
        </nav>
      </header>
    </>
  );
}
