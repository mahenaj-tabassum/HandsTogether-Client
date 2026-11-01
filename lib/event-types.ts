// ADJUST: keep this list the same as the Create Event dropdown. We will reuse it there.
export const EVENT_TYPES = [
  "Plantation",
  "Cleanup",
  "Donation",
  "Education",
  "Health",
] as const;

// Tinted background + solid text (design report). Color is only a hint, the label carries the meaning.
const chipStyles: Record<string, string> = {
  Plantation:
    "bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300",
  Cleanup: "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300",
  Donation:
    "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
  Education:
    "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300",
  Health: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
};

export function getTypeChipClass(type: string) {
  return chipStyles[type] ?? "bg-muted text-foreground"; // unknown type still looks fine
}
