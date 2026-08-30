export const CATEGORIES = [
  "Gaming",
  "Tech & Reviews",
  "Vlogs & Lifestyle",
  "Comedy & Sketches",
  "Education",
  "Music",
  "Finance & Business",
  "Food & Cooking",
  "Fitness & Health",
  "Beauty & Fashion",
  "Travel",
  "News & Commentary",
  "Kids & Family",
  "Art & Animation",
  "Podcasts & Talk",
  "Other",
];

// Used to tell whether two entered URLs point at "the same channel", so a
// second claim for a channel that's already on the board moves it instead
// of creating a duplicate listing (ignores http/https, www., trailing slash,
// and case differences).
export function normalizeChannelUrl(url) {
  return String(url || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
} 