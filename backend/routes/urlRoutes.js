const express = require("express");

const {
  createShortUrl,
  getMyUrls,
  deleteUrl,
  getUrlAnalytics,
} = require("../controllers/urlController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createShortUrl);

router.get("/my", protect, getMyUrls);

router.get("/:id/analytics", protect, getUrlAnalytics);

router.delete("/:id", protect, deleteUrl);

module.exports = router;
