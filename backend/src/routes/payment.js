import { Router } from "express";
import crypto from "node:crypto";
import Channel from "../models/Channel.js";
import Placement from "../models/Placement.js";
import Order from "../models/Order.js";
import { normalizeChannelUrl } from "../constants.js";

const router = Router();

router.post("/verify", async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status === "paid") {
      return res.status(409).json({ error: "Order already processed" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.status = "failed";
      await order.save();
      return res.status(400).json({ error: "Payment signature verification failed" });
    }

    const targetRank = order.targetRank;
    const payload = order.channelPayload;
    const now = new Date();
    const urlKey = normalizeChannelUrl(payload.url);

    // Does this channel already hold a spot on the board? If so, this claim
    // moves/updates that existing entry instead of creating a duplicate.
    const existing = await Channel.findOne({ urlKey, status: "active" });

    let channel;
    let finalRank;
    let eventType;

    if (existing) {
      const oldRank = existing.rank;

      // Close the gap left behind at the channel's old rank.
      await Channel.updateMany(
        { rank: { $gt: oldRank }, status: "active" },
        { $inc: { rank: -1 } }
      );

      // If the target rank was below (numerically greater than) the old
      // rank, closing that gap already shifted it up by one.
      finalRank = targetRank > oldRank ? targetRank - 1 : targetRank;

      // Make room at the (possibly adjusted) target rank for everyone else.
      await Channel.updateMany(
        { rank: { $gte: finalRank }, status: "active", _id: { $ne: existing._id } },
        { $inc: { rank: 1 } }
      );

      existing.name = payload.name;
      existing.url = payload.url;
      existing.urlKey = urlKey;
      existing.thumbnailUrl = payload.thumbnailUrl || null;
      existing.description = payload.description || null;
      existing.category = payload.category;
      existing.subscribers = payload.subscribers || null;
      existing.rank = finalRank;
      existing.pricePaise = order.amountPaise;
      existing.claimedAt = now;
      await existing.save();

      channel = existing;
      eventType = "update";
    } else {
      finalRank = targetRank;

      // Push every channel at or below the target rank down by one.
      await Channel.updateMany(
        { rank: { $gte: finalRank }, status: "active" },
        { $inc: { rank: 1 } }
      );

      channel = await Channel.create({
        name: payload.name,
        url: payload.url,
        urlKey,
        thumbnailUrl: payload.thumbnailUrl || null,
        description: payload.description || null,
        category: payload.category,
        subscribers: payload.subscribers || null,
        rank: finalRank,
        pricePaise: order.amountPaise,
        status: "active",
        views: 0,
        claimedAt: now,
        createdAt: now,
      });

      eventType = "new";
    }

    await Placement.create({
      channelId: channel._id,
      channelName: channel.name,
      rank: finalRank,
      pricePaise: order.amountPaise,
      eventType,
      createdAt: now,
    });

    order.status = "paid";
    order.channelId = channel._id;
    await order.save();

    res.json({ ok: true, channelId: channel._id, rank: finalRank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not finalize placement" });
  }
});

export default router;