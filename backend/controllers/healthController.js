const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "URL Shortener API is running",
  });
};

module.exports = {
  getHealth,
};
