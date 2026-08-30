import mongoose from "mongoose";
import { nanoid } from "nanoid";

const channelSchema = new mongoose.Schema({
  _id: { type: String, default: () => nanoid(12) },
  name: { type: String, required: true },
  url: { type: String, required: true },
  urlKey: { type: String, required: true, index: true },
  thumbnailUrl: { type: String, default: null },
  description: { type: String, default: null },
  category: { type: String, required: true },
  subscribers: { type: String, default: null },
  rank: { type: Number, required: true, index: true },
  pricePaise: { type: Number, required: true },
  status: { type: String, default: "active", index: true }, // active | removed
  views: { type: Number, default: 0 },
  claimedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Channel", channelSchema);