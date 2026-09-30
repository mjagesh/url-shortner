const API_URL = import.meta.env.VITE_API_URL;

export const createShortUrl = async (originalUrl, token) => {
  const response = await fetch(`${API_URL}/api/urls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const getMyUrls = async (token) => {
  const response = await fetch(`${API_URL}/api/urls/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch URLs");
  }

  return data;
};

export const deleteUrl = async (id, token) => {
  const response = await fetch(`${API_URL}/api/urls/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete URL");
  }

  return data;
};

export const getUrlAnalytics = async (id, token) => {
  const response = await fetch(`${API_URL}/api/urls/${id}/analytics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch URL analytics");
  }

  return data;
};
