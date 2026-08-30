import { Router } from "express";

const router = Router();

function formatCompact(n) {
  if (n === null || n === undefined) return null;
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

router.get("/lookup", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "YOUTUBE_API_KEY is not set on the server. Add it to backend/.env.",
      });
    }

    let handle = (req.query.handle || "").trim();
    if (!handle) return res.status(400).json({ error: "handle is required" });

    // Accept "@mkbhd", "mkbhd", or a full URL like youtube.com/@mkbhd
    handle = handle.replace(/^https?:\/\/(www\.)?youtube\.com\//i, "");
    handle = handle.replace(/^@/, "");

    const url = new URL("https://www.googleapis.com/youtube/v3/channels");
    url.searchParams.set("part", "snippet,statistics");
    url.searchParams.set("forHandle", handle);
    url.searchParams.set("key", apiKey);

    const ytRes = await fetch(url);
    const data = await ytRes.json();

    if (!ytRes.ok) {
      const message = data?.error?.message || "YouTube API request failed";
      return res.status(ytRes.status).json({ error: message });
    }

    const channel = data.items?.[0];
    if (!channel) {
      return res.status(404).json({ error: `No YouTube channel found for @${handle}` });
    }

    const thumbnail =
      channel.snippet.thumbnails?.high?.url ||
      channel.snippet.thumbnails?.medium?.url ||
      channel.snippet.thumbnails?.default?.url ||
      null;

    res.json({
      name: channel.snippet.title,
      url: `https://www.youtube.com/@${handle}`,
      thumbnailUrl: thumbnail,
      subscribers: channel.statistics?.hiddenSubscriberCount
        ? null
        : formatCompact(Number(channel.statistics?.subscriberCount)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not look up channel" });
  }
});

export default router;