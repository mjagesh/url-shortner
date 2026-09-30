import { UAParser } from "ua-parser-js";

export const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return {
      browser: "Unknown",
      os: "Unknown",
      device: "Desktop",
    };
  }

  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  let deviceType = "Desktop";

  if (device.type === "mobile") {
    deviceType = "Mobile";
  } else if (device.type === "tablet") {
    deviceType = "Tablet";
  }

  return {
    browser: browser.name || "Unknown",
    os: os.name || "Unknown",
    device: deviceType,
  };
};
