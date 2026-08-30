// routes/claim.js
import { Router } from "express";
import Channel from "../models/Channel.js";
import Order from "../models/Order.js";
import { razorpay } from "../razorpay.js";
import { CATEGORIES } from "../constants.js";

const router = Router();
const MIN_CLAIM_PAISE = Number(process.env.MIN_CLAIM_PAISE || 500);

// Calculates minimum price required to take or hold a rank
async function priceToClaim(targetRank) {
  // 1. Check if target rank itself is occupied (must outbid current occupant by ₹1)
  const occupant = await Channel.findOne({ rank: targetRank, status: "active" }).lean();
  if (occupant) {
    return occupant.pricePaise + 100;
  }

  // 2. If target rank is open, check if there is a rank ABOVE it that sets a higher floor price
  const higherOccupant = await Channel.findOne({ rank: { $lt: targetRank }, status: "active" })
    .sort({ rank: -1 })
    .lean();

  // Price cannot be lower than the floor price
  return Math.max(MIN_CLAIM_PAISE, higherOccupant ? Math.floor(higherOccupant.pricePaise * 0.5) : MIN_CLAIM_PAISE);
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
    const { name, url, thumbnailUrl, description, category, subscribers, targetRank, amountPaise } = req.body;

    if (!name || !url || !category) {
      return res.status(400).json({ error: "name, url and category are required" });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Unknown category" });
    }

    const rank = targetRank && targetRank > 0 ? Number(targetRank) : await nextOpenRank();
    const minRequiredPaise = await priceToClaim(rank);

    let finalAmountPaise = minRequiredPaise;
    if (amountPaise !== undefined && amountPaise !== null) {
      const parsedUserPaise = Number(amountPaise);
      // Validate that user bid meets minimum rank requirement
      if (isNaN(parsedUserPaise) || parsedUserPaise < minRequiredPaise) {
        return res.status(400).json({
          error: `Minimum required bid for rank #${rank} is ₹${(minRequiredPaise / 100).toLocaleString("en-IN")}`,
        });
      }
      finalAmountPaise = parsedUserPaise;
    }

    const order = await razorpay.orders.create({
      amount: finalAmountPaise,
      currency: "INR",
      receipt: `bidtuber_${Date.now()}`,
      notes: { channel_name: name, target_rank: String(rank) },
    });

    await Order.create({
      _id: order.id,
      channelId: null,
      channelPayload: { name, url, thumbnailUrl, description, category, subscribers },
      targetRank: rank,
      amountPaise: finalAmountPaise,
      status: "created",
    });

    res.json({
      orderId: order.id,
      amountPaise: finalAmountPaise,
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