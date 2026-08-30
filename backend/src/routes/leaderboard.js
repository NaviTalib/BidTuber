import { Router } from "express";
import Channel from "../models/Channel.js";

const router = Router();

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

router.get("/", async (req, res) => {
  try {
    const { period = "alltime", category } = req.query;

    const query = { status: "active" };
    if (period === "today") query.claimedAt = { $gte: startOfToday() };
    if (category && category !== "all") query.category = category;

    const channels = await Channel.find(query).sort({ rank: 1 }).lean();

    // Aggregate both total price in paise and total visitors (sum of channel views)
    const statsAgg = await Channel.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: null,
          totalPaise: { $sum: "$pricePaise" },
          totalVisitors: { $sum: "$views" },
        },
      },
    ]);

    const totalVerifiedPaise = statsAgg[0]?.totalPaise || 0;
    const totalVisitors = statsAgg[0]?.totalVisitors || 0;

    const onlineNow = 40 + Math.floor(Math.random() * 60);

    res.json({
      channels: channels.map((c) => ({
        id: c._id,
        name: c.name,
        url: c.url,
        thumbnail_url: c.thumbnailUrl,
        description: c.description,
        category: c.category,
        subscribers: c.subscribers,
        rank: c.rank,
        price_paise: c.pricePaise,
        views: c.views,
        claimed_at: c.claimedAt,
      })),
      totalVerifiedPaise,
      totalVisitors, // 👈 Added totalVisitors to JSON response
      onlineNow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load leaderboard" });
  }
});

router.post("/:id/view", async (req, res) => {
  try {
    const result = await Channel.updateOne({ _id: req.params.id }, { $inc: { views: 1 } });
    if (result.matchedCount === 0) return res.status(404).json({ error: "Channel not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not register view" });
  }
});

export default router;