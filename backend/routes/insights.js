const express = require("express");
const Insights = require("../models/Insights");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @route  GET /insights
 * @desc   Get business insights data
 * @access Protected
 */
router.get("/insights", protect, async (req, res) => {
  try {
    const insights = await Insights.findOne().lean();

    if (!insights) {
      return res.status(404).json({
        success: false,
        message: "No insights data found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Insights fetched successfully",
      data: insights,
    });
  } catch (err) {
    console.error("Insights fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching insights",
    });
  }
});

module.exports = router;
