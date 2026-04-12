const express = require("express");
const Business = require("../models/Business");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @route  GET /business
 * @desc   Get business profile details
 * @access Protected
 */
router.get("/business", protect, async (req, res) => {
  try {
    const business = await Business.findOne().lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "No business profile found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business details fetched successfully",
      data: business,
    });
  } catch (err) {
    console.error("Business fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching business details",
    });
  }
});

module.exports = router;
