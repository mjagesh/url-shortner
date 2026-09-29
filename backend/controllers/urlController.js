const { isValidUrl, generateShortCode } = require("../utils/urlUtils");
const Url = require("../models/Url");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "Original URL is required",
      });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL",
      });
    }

    let shortCode;

    do {
      shortCode = generateShortCode(6);
    } while (await Url.exists({ shortCode }));

    const url = await Url.create({
      originalUrl,
      shortCode,
    });

    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;

    res.status(201).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl,
      },
    });
  } catch (error) {
    console.error("Create short URL error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create short URL",
    });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect URL error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to redirect",
    });
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
};
