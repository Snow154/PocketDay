export const CALENDAR_RANGE = 30;
export const TODAY_INDEX = CALENDAR_RANGE;

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const TODAY_KEY = toDateKey(new Date());

export const calendarDays = Array.from(
  { length: CALENDAR_RANGE * 2 + 1 },
  (_, index) => {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(
      date.getDate() + index - CALENDAR_RANGE
    );

    return date;
  }
);

export function formatLongDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

  return (
    formattedDate.charAt(0).toUpperCase() +
    formattedDate.slice(1)
  );
}

export function dateKeyToDate(dateKey: string) {
  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day, 12);
}

export function formatTaskDate(date: Date) {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}