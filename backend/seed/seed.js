require("dotenv").config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Business = require("../models/Business");
const Insights = require("../models/Insights");
const Review = require("../models/Review");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/business_insights";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Business.deleteMany({}),
      Insights.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Seed User
    await User.create({
      email: "admin@business.com",
      password: "password123",
    });
    console.log("👤 User seeded: admin@business.com / password123");

    // Seed Business
    await Business.create({
      name: "ABC Salon",
      category: "Beauty Salon",
      address: "Hyderabad, Telangana, India",
      phone: "9876543210",
      rating: 4.2,
      total_reviews: 120,
    });
    console.log("🏢 Business seeded");

    // Seed Insights
    await Insights.create({
      profile_views: 1200,
      search_views: 800,
      website_clicks: 150,
      phone_calls: 60,
      direction_requests: 40,
    });
    console.log("📊 Insights seeded");

    // Seed Reviews
    await Review.insertMany([
      {
        name: "Ravi Kumar",
        rating: 5,
        comment: "Absolutely fantastic service! The staff was very professional and friendly. Will definitely come back.",
        date: "2026-03-20",
      },
      {
        name: "Priya Sharma",
        rating: 4,
        comment: "Nice experience overall. The salon is clean and well-maintained. Loved the hair treatment.",
        date: "2026-03-18",
      },
      {
        name: "Ananya Reddy",
        rating: 5,
        comment: "Best salon in Hyderabad! Great ambiance, skilled staff, and reasonable prices.",
        date: "2026-03-15",
      },
      {
        name: "Suresh Patel",
        rating: 3,
        comment: "Decent place. Service was okay but had to wait a bit. Could be better organized.",
        date: "2026-03-12",
      },
      {
        name: "Meena Iyer",
        rating: 5,
        comment: "Loved every bit of it! The facial was amazing and the team was super attentive.",
        date: "2026-03-10",
      },
      {
        name: "Kiran Bose",
        rating: 4,
        comment: "Very good service. Booked online without any hassle. The stylist really understood what I wanted.",
        date: "2026-03-08",
      },
      {
        name: "Deepa Nair",
        rating: 5,
        comment: "Outstanding! My hair has never looked better. Highly recommend their keratin treatment.",
        date: "2026-03-05",
      },
      {
        name: "Arjun Verma",
        rating: 4,
        comment: "Great value for money. The staff is friendly and skilled. Would recommend to friends.",
        date: "2026-03-01",
      },
    ]);
    console.log("⭐ Reviews seeded (8 reviews)");

    console.log("\n✅ Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Login credentials:");
    console.log("  Email:    admin@business.com");
    console.log("  Password: password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedData();
