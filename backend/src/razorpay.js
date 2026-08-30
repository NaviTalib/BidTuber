import Razorpay from "razorpay";
import "dotenv/config";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "[bidtuber] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set. " +
      "Copy .env.example to .env and add your Razorpay keys before accepting real payments."
  );
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});