import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // razorpay order id
  channelId: { type: String, default: null },
  channelPayload: { type: Object, required: true },
  targetRank: { type: Number, required: true },
  amountPaise: { type: Number, required: true },
  status: { type: String, default: "created" }, // created | paid | failed
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
