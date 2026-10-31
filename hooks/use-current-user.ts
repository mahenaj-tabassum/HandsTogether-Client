"use client";

import { authClient } from "@/lib/auth-client"; // adjust to your authClient path

export type CurrentUser = {
  name: string;
  email: string;
  image: string | null;
};

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();

  const user: CurrentUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }
    : null;

  return { user, isPending };
}
