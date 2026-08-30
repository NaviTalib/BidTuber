import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./db.js";
import categoriesRouter from "./routes/categories.js";
import leaderboardRouter from "./routes/leaderboard.js";
import claimRouter from "./routes/claim.js";
import paymentRouter from "./routes/payment.js";
import movementRouter from "./routes/movement.js";
import youtubeRouter from "./routes/youtube.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/categories", categoriesRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/claim", claimRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/movement", movementRouter);
app.use("/api/youtube", youtubeRouter);

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`BidTuber API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("[bidtuber] Could not connect to MongoDB:", err.message);
    process.exit(1);
  });