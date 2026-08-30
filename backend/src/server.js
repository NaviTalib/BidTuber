import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./db.js";
import categoriesRouter from "./routes/categories.js";
import leaderboardRouter from "./routes/leaderboard.js";
import claimRouter from "./routes/claim.js";
import paymentRouter from "./routes/payment.js";
import movementRouter from "./routes/movement.js";
import youtubeRouter from "./routes/youtube.js";

const app = express();
const server = createServer(app);

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
  })
);
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    methods: ["GET", "POST"],
  },
});

let activeConnections = 0;

io.on("connection", (socket) => {
  activeConnections++;
  
  // Broadcast updated live viewer count to all connected clients
  io.emit("stats_update", { onlineNow: activeConnections });

  socket.on("disconnect", () => {
    activeConnections = Math.max(0, activeConnections - 1);
    io.emit("stats_update", { onlineNow: activeConnections });
  });
});

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
    // Listen on the HTTP server wrapper instead of app.listen
    server.listen(port, () => {
      console.log(`BidTuber API & Sockets listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("[bidtuber] Could not connect to MongoDB:", err.message);
    process.exit(1);
  });