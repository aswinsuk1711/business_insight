const mongoose = require("mongoose");

const insightsSchema = new mongoose.Schema(
  {
    profile_views: { type: Number, required: true, default: 0 },
    search_views: { type: Number, required: true, default: 0 },
    website_clicks: { type: Number, required: true, default: 0 },
    phone_calls: { type: Number, required: true, default: 0 },
    direction_requests: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insights", insightsSchema);
