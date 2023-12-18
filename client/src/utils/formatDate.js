// ~*~* toISODateSTring function:
// ~*~* takes a date object and converts to ISO format string
// ~*~* such as "2023-12-01"
export function toISODateString(localDateStr) {
  const myDate = new Date(localDateStr); // This will yield 0:00:00 local time (or 7:00:00/8:00:00 UTC since we are in Pacific Time Zone)
  const dayOfMonth = myDate.getDate();
  const month = myDate.getMonth();
  const year = myDate.getFullYear();
  // ~*~* 'pad' function just adds a leading '0' when needed
  const pad = (n) => (n < 10 ? "0" + n : n);
  return year + "-" + pad(month + 1) + "-" + pad(dayOfMonth);
}

// ~*~* Accept string that comes through in this format: "2023-12-03" (ISO)
// ~*~* and return string 'month/day/year' for example: "12/01/2023" (local)
export function toLocalDateString(ISODateString) {
  return (
  ISODateString.substring(5, 7) + "/" +
  ISODateString.substring(8, 10) + "/" +
  ISODateString.substring(0, 4)
  )
}