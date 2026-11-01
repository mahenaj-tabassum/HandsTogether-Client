// timeZone "UTC" matches how the server stores dates, so "Dec 14" never turns into "Dec 13".

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export const formatEventDate = (iso: string) => {
  return dateFormatter.format(new Date(iso));
};
