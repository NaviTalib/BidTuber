import mongoose from "mongoose";
import { nanoid } from "nanoid";

const placementSchema = new mongoose.Schema({
  _id: { type: String, default: () => nanoid(12) },
  channelId: { type: String, required: true, index: true },
  channelName: { type: String, required: true },
  rank: { type: Number, required: true },
  pricePaise: { type: Number, required: true },
  eventType: { type: String, required: true }, // new | update
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model("Placement", placementSchema);
