import {
  format,
  isThisYear,
  formatDistanceStrict,
  formatDistanceToNow,
} from "date-fns";

export function formatPostDate(date) {
  const formatShort = format(new Date(date), "MMMM d").toUpperCase();
  const formatLong = format(new Date(date), "MMMM d, yyy").toUpperCase();
  return isThisYear(new Date(date)) ? formatShort : formatLong;
}

export function formatDateToNowShort(date) {
  return formatDistanceStrict(new Date(date), new Date(Date.now()))
    .split(" ")
    .map((string, index) => (index === 1 ? string[0] : string))
    .join("");
}

export function formatDateToNow(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true }).toUpperCase();
}
