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

// Environment variable with fallbacks
const configuredOrigin = process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173";

// Helper function to check if origin is allowed
const isAllowedOrigin = (origin) => {
  // Allow requests with no origin (like mobile apps, curl, server-to-server)
  if (!origin) return true;
  
  // Allow configured origin or local development
  if (origin === configuredOrigin || origin.startsWith("http://localhost:")) return true;
  
  // Allow any vercel.app deployment URL
  if (origin.endsWith(".vercel.app")) return true;

  return false;
};

// CORS middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked]: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Socket.io Setup with flexible CORS origin matching
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
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
    // Listen on 0.0.0.0 to bind properly to cloud providers like Render
    server.listen(port, "0.0.0.0", () => {
      console.log(`BidTuber API & Sockets listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("[bidtuber] Could not connect to MongoDB:", err.message);
    process.exit(1);
  });