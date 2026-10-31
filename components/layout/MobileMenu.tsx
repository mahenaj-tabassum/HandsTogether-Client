"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "@/components/layout/NavLinks";
import { userMenuLinks } from "@/lib/nav-links";
import type { CurrentUser } from "@/hooks/use-current-user";
import { useLogout } from "@/hooks/use-logout";

export function MobileMenu({ user }: { user: CurrentUser | null }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const logout = useLogout()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          aria-label="Open menu"
          className="size-11 rounded-full p-0 md:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-75 p-6">
        <SheetHeader className="p-0">
          <SheetTitle className="font-heading text-xl font-extrabold">
            Menu
          </SheetTitle>
        </SheetHeader>

        <NavLinks
          onNavigate={close}
          className="mt-6 flex-col items-start gap-4"
        />

        <div className="my-6 h-px bg-border" />

        {user ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="mb-3 text-xs text-muted-foreground">{user.email}</p>
            {userMenuLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="flex h-11 items-center rounded-lg px-3 text-[15px] font-medium transition-colors hover:bg-accent"
              >
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={logout}
              className="flex h-11 w-full items-center gap-2 rounded-lg px-3 text-[15px] font-medium text-destructive transition-colors hover:bg-accent"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button asChild className="h-12 rounded-full font-semibold">
              <Link href="/login" onClick={close}>
                Login
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full font-semibold"
            >
              <Link href="/register" onClick={close}>
                Register
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
