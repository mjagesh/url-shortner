const API_URL = import.meta.env.VITE_API_URL;

export const createShortUrl = async (originalUrl) => {
  const response = await fetch(`${API_URL}/api/urls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originalUrl,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create short URL");
  }

  return data;
};
