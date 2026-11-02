// timeZone "UTC" matches how the server stores dates, so "Dec 14" never turns into "Dec 13".

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export function formatEventDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Date not set yet";
  return dateFormatter.format(date);
}

// "14:30" -> "2:30 PM". Plain string math, no Date, so no timezone surprises.
export const formatEventTime = (time?: string): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};
