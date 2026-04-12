require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/business");
const insightsRoutes = require("./routes/insights");
const reviewsRoutes = require("./routes/reviews");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Business Insights API is running 🚀",
    version: "1.0.0",
    endpoints: [
      "POST /login",
      "GET  /business",
      "GET  /insights",
      "GET  /reviews",
    ],
  });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/", authRoutes);
app.use("/", businessRoutes);
app.use("/", insightsRoutes);
app.use("/", reviewsRoutes);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Database + Server ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/business_insights";

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
