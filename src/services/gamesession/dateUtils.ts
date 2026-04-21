export const formatDateTimeNL = (dateStr: string): string =>
  new Date(dateStr).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDateNL = (dateStr: string): string =>
  new Date(dateStr).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });