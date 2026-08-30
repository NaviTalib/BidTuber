import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bidtuber";
  await mongoose.connect(uri);
  console.log(`[bidtuber] connected to MongoDB at ${uri}`);
}

export default mongoose;
