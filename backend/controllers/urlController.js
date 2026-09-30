const { isValidUrl, generateShortCode } = require("../utils/urlUtils");
const Url = require("../models/Url");
const Click = require("../models/Click");

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
      user: req.user._id,
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

    const url = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true },
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    await Click.create({
      url: url._id,
      clickedAt: new Date(),
      referrer: req.get("referer") || null,
      userAgent: req.get("user-agent") || null,
    });

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect URL error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to redirect URL",
    });
  }
};

const getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error("Get my URLs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch URLs",
    });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    await Url.deleteOne({
      _id: url._id,
    });

    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error("Delete URL error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete URL",
    });
  }
};

const getUrlAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Url.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    const clicks = await Click.find({
      url: url._id,
    })
      .sort({
        clickedAt: -1,
      })
      .select("clickedAt referrer userAgent");

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfSevenDays = new Date(now);
    startOfSevenDays.setDate(startOfSevenDays.getDate() - 6);
    startOfSevenDays.setHours(0, 0, 0, 0);

    const todayClicks = clicks.filter(
      (click) => click.clickedAt >= startOfToday,
    ).length;

    const last7DaysClicks = clicks.filter(
      (click) => click.clickedAt >= startOfSevenDays,
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        totalClicks: url.clicks,
        todayClicks,
        last7DaysClicks,
        clicks,
      },
    });
  } catch (error) {
    console.error("Get URL analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch URL analytics",
    });
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getMyUrls,
  deleteUrl,
  getUrlAnalytics,
};
