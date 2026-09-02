const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;

export function formatPostedAt(postedAt: string, now = Date.now()) {
  const elapsed = Math.max(now - Date.parse(postedAt), 0);

  if (elapsed >= month) return `${Math.floor(elapsed / month)}mo ago`;
  if (elapsed >= week) return `${Math.floor(elapsed / week)}w ago`;
  if (elapsed >= day) return `${Math.floor(elapsed / day)}d ago`;
  if (elapsed >= hour) return `${Math.floor(elapsed / hour)}h ago`;

  return `${Math.floor(elapsed / minute)}m ago`;
}
