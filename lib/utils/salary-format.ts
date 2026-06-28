const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatSalaryMonth(month: number, year: number) {
  return `${MONTHS[month - 1] ?? month} ${year}`;
}
