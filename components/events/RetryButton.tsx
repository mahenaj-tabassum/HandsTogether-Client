"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RetryButton() {
  const router = useRouter();
  // router.refresh() asks the server to render this page again, without a full reload
  return (
    <Button
      variant="outline"
      onClick={() => router.refresh()}
      className="mt-6 h-12 rounded-full px-7 font-semibold"
    >
      Try again
    </Button>
  );
}
