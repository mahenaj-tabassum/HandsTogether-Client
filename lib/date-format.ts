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
