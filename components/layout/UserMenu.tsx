"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CalendarPlus,
  LayoutList,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userMenuLinks } from "@/lib/nav-links";
import type { CurrentUser } from "@/hooks/use-current-user";
import { useLogout } from "@/hooks/use-logout";

const icons = [CalendarPlus, LayoutList, CalendarCheck, User];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ user }: { user: CurrentUser }) {
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          title={user.name}
          className="rounded-full cursor-pointer ring-2 ring-transparent transition duration-150 ease-out hover:scale-105 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-ring"
        >
          <Avatar className="size-11">
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 rounded-card p-2 duration-200"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {userMenuLinks.map(({ href, label }, i) => {
          const Icon = icons[i];
          return (
            <DropdownMenuItem
              key={href}
              asChild
              className="h-11 cursor-pointer rounded-lg px-3"
            >
              <Link href={href}>
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={logout}
          className="h-11 cursor-pointer rounded-lg px-3 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
