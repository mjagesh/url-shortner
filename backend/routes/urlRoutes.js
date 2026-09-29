const express = require("express");

const {
  createShortUrl,
  redirectToOriginalUrl,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/", createShortUrl);
router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;
