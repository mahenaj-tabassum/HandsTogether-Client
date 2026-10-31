"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client"; // adjust to your authClient path

export function useLogout() {
  const router = useRouter();

  return async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You have been logged out");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("Could not log out. Please try again.");
        },
      },
    });
  };
}
