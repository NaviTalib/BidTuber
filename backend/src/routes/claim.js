import { Router } from "express";
import Channel from "../models/Channel.js";
import Order from "../models/Order.js";
import { razorpay } from "../razorpay.js";
import { CATEGORIES } from "../constants.js";

const router = Router();
const MIN_CLAIM_PAISE = Number(process.env.MIN_CLAIM_PAISE || 500);

// What it costs to claim a given rank right now.
// An occupied rank must be out-bid by ₹1. An open rank at the bottom
// of the board costs the floor price.
async function priceToClaim(targetRank) {
  const occupant = await Channel.findOne({ rank: targetRank, status: "active" }).lean();
  if (!occupant) return MIN_CLAIM_PAISE;
  return occupant.pricePaise + 100;
}

async function nextOpenRank() {
  const top = await Channel.findOne({ status: "active" }).sort({ rank: -1 }).lean();
  return (top?.rank || 0) + 1;
}

router.get("/quote", async (req, res) => {
  try {
    const targetRank = Number(req.query.targetRank);
    if (!targetRank || targetRank < 1) {
      return res.status(400).json({ error: "targetRank must be a positive integer" });
    }
    res.json({ targetRank, amountPaise: await priceToClaim(targetRank) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not calculate quote" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, url, thumbnailUrl, description, category, subscribers, targetRank } = req.body;

    if (!name || !url || !category) {
      return res.status(400).json({ error: "name, url and category are required" });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Unknown category" });
    }

    const rank = targetRank && targetRank > 0 ? Number(targetRank) : await nextOpenRank();
    const amountPaise = await priceToClaim(rank);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `bidtuber_${Date.now()}`,
      notes: { channel_name: name, target_rank: String(rank) },
    });

    await Order.create({
      _id: order.id,
      channelId: null,
      channelPayload: { name, url, thumbnailUrl, description, category, subscribers },
      targetRank: rank,
      amountPaise,
      status: "created",
    });

    res.json({
      orderId: order.id,
      amountPaise,
      currency: "INR",
      targetRank: rank,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});

export default router;
