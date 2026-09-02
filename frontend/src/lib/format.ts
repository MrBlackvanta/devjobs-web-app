export function formatWebsite(website: string) {
  return website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
