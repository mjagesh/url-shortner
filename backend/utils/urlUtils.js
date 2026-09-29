const isValidUrl = (value) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
};

const generateShortCode = (length = 6) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);

    result += characters[randomIndex];
  }

  return result;
};

module.exports = {
  isValidUrl,
  generateShortCode,
};
