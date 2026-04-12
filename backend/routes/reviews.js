const express = require("express");
const Review = require("../models/Review");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @route  GET /reviews
 * @desc   Get all reviews
 * @access Protected
 */
router.get("/reviews", protect, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 }).lean();

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    console.error("Reviews fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching reviews",
    });
  }
});

module.exports = router;
