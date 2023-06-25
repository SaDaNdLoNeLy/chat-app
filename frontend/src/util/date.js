export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const DATES = [...Array(31).keys()].map((idx) => idx + 1);
export const YEARS = [...Array(100).keys()]
  .reverse()
  .map((idx) => new Date().getFullYear() - 99 + idx);

export const zeroPad = (num, places) => String(num).padStart(places, "0");
