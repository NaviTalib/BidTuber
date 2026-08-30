import { Router } from "express";
import Placement from "../models/Placement.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await Placement.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json({
      movements: rows.map((m) => ({
        id: m._id,
        channel_id: m.channelId,
        channel_name: m.channelName,
        rank: m.rank,
        price_paise: m.pricePaise,
        event_type: m.eventType,
        created_at: m.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load movement feed" });
  }
});

export default router;
