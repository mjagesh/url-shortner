import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { parseUserAgent } from "../utils/parseUserAgent";
import {
  createShortUrl,
  getMyUrls,
  deleteUrl,
  getUrlAnalytics,
} from "../services/urlService";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, token, logout } = useAuth();

  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyUrls(token);

        setUrls(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUrls();
    }
  }, [token]);

  const handleCreateUrl = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setCreateError("Please enter a URL");
      return;
    }

    try {
      setCreating(true);
      setCreateError("");

      const response = await createShortUrl(url, token);

      setUrls((previousUrls) => [response.data, ...previousUrls]);

      setUrl("");
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shortened URL?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUrl(id, token);

      setUrls((previousUrls) => previousUrls.filter((item) => item._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAnalytics = async (url) => {
    try {
      setSelectedUrl(url);
      setAnalytics(null);
      setAnalyticsError("");
      setAnalyticsLoading(true);

      const response = await getUrlAnalytics(url._id, token);

      setAnalytics(response.data);
    } catch (error) {
      console.error("Analytics error:", error);
      setAnalyticsError(error.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const getVisitorInfo = (userAgent) => {
    return parseUserAgent(userAgent);
  };

  const getAnalyticsBreakdown = (clicks) => {
    const devices = {};
    const browsers = {};
    const operatingSystems = {};
    const referrers = {};

    clicks.forEach((click) => {
      const visitor = parseUserAgent(click.userAgent);

      devices[visitor.device] = (devices[visitor.device] || 0) + 1;

      browsers[visitor.browser] = (browsers[visitor.browser] || 0) + 1;

      operatingSystems[visitor.os] = (operatingSystems[visitor.os] || 0) + 1;

      const referrer = click.referrer || "Direct";

      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });

    return {
      devices,
      browsers,
      operatingSystems,
      referrers,
    };
  };

  const breakdown = analytics ? getAnalyticsBreakdown(analytics.clicks) : null;

  const getDailyClicks = (clicks) => {
    const dailyClicks = {};

    clicks.forEach((click) => {
      const date = new Date(click.clickedAt).toLocaleDateString("en-IN");

      dailyClicks[date] = (dailyClicks[date] || 0) + 1;
    });

    return Object.entries(dailyClicks).reverse();
  };

  const dailyClicks = analytics ? getDailyClicks(analytics.clicks) : [];

  return (
    <main className="dashboard">
      <div className="dashboard-container">
        {/* Header */}

        <header className="dashboard-header">
          <div>
            <h1>URL Shortener</h1>
            <p>Manage and track your shortened URLs.</p>

            <p>Welcome back, {user?.name}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </header>

        {/* Create URL */}

        <section className="dashboard-card">
          <h2>Create Short URL</h2>

          <form onSubmit={handleCreateUrl}>
            <div className="url-form">
              <input
                type="url"
                placeholder="Enter your long URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button type="submit" disabled={creating}>
                {creating ? "Shortening..." : "Shorten URL"}
              </button>
            </div>
          </form>

          {createError && <p className="error">{createError}</p>}
        </section>

        {/* My URLs */}

        <section className="dashboard-card">
          <h2>My URLs</h2>

          {loading && <p>Loading URLs...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && urls.length === 0 && (
            <p>You haven't created any shortened URLs yet.</p>
          )}

          {!loading && !error && urls.length > 0 && (
            <>
              <div className="url-list">
                {urls.map((item) => {
                  const shortUrl = `${import.meta.env.VITE_API_URL}/${item.shortCode}`;

                  return (
                    <div className="url-item" key={item._id}>
                      <div>
                        <p>
                          <strong>Original URL</strong>
                        </p>

                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.originalUrl}
                        </a>
                      </div>

                      <div>
                        <p>
                          <strong>Short URL</strong>
                        </p>

                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {shortUrl}
                        </a>

                        <button
                          type="button"
                          onClick={() => handleAnalytics(item)}
                        >
                          Analytics
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(shortUrl)}
                        >
                          Copy
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>

                      <div>
                        <p>
                          <strong>Clicks</strong>
                        </p>

                        <span>{item.clicks}</span>
                      </div>

                      <div>
                        <p>
                          <strong>Created:</strong>{" "}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedUrl && (
                <div className="analytics-panel">
                  <div className="analytics-header">
                    <h2>URL Analytics</h2>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUrl(null);
                        setAnalytics(null);
                        setAnalyticsError("");
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <p className="analytics-url">{selectedUrl.originalUrl}</p>

                  {analyticsLoading && <p>Loading analytics...</p>}

                  {analyticsError && (
                    <p className="error-message">{analyticsError}</p>
                  )}

                  {analytics && (
                    <div className="analytics-content">
                      <div className="analytics-summary">
                        <div className="analytics-stat">
                          <span>Total Clicks</span>
                          <strong>{analytics.totalClicks}</strong>
                        </div>

                        <div className="analytics-stat">
                          <span>Today</span>
                          <strong>{analytics.todayClicks}</strong>
                        </div>

                        <div className="analytics-stat">
                          <span>Last 7 Days</span>
                          <strong>{analytics.last7DaysClicks}</strong>
                        </div>
                      </div>

                      <div className="analytics-clicks">
                        <h3>Recent Clicks</h3>

                        {analytics.clicks.length === 0 ? (
                          <p>No clicks recorded yet.</p>
                        ) : (
                          analytics.clicks.map((click) => {
                            const visitor = getVisitorInfo(click.userAgent);

                            return (
                              <div key={click._id}>
                                <p>
                                  <strong>
                                    {new Date(click.clickedAt).toLocaleString(
                                      "en-IN",
                                    )}
                                  </strong>
                                </p>

                                <p>Browser: {visitor.browser}</p>

                                <p>OS: {visitor.os}</p>

                                <p>Device: {visitor.device}</p>

                                <p>Referrer: {click.referrer || "Direct"}</p>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="analytics-breakdowns">
                        <div className="analytics-breakdown">
                          <h3>Devices</h3>

                          {Object.entries(breakdown.devices).map(
                            ([device, count]) => (
                              <p key={device}>
                                {device}: {count}
                              </p>
                            ),
                          )}
                        </div>

                        <div className="analytics-breakdown">
                          <h3>Browsers</h3>

                          {Object.entries(breakdown.browsers).map(
                            ([browser, count]) => (
                              <p key={browser}>
                                {browser}: {count}
                              </p>
                            ),
                          )}
                        </div>

                        <div className="analytics-breakdown">
                          <h3>Operating Systems</h3>

                          {Object.entries(breakdown.operatingSystems).map(
                            ([os, count]) => (
                              <p key={os}>
                                {os}: {count}
                              </p>
                            ),
                          )}
                        </div>

                        <div className="analytics-breakdown">
                          <h3>Referrers</h3>

                          {Object.entries(breakdown.referrers).map(
                            ([referrer, count]) => (
                              <p key={referrer}>
                                {referrer}: {count}
                              </p>
                            ),
                          )}
                        </div>
                      </div>
                      <div className="analytics-daily">
                        <h3>Clicks Over Time</h3>

                        {dailyClicks.length === 0 ? (
                          <p>No click activity yet.</p>
                        ) : (
                          dailyClicks.map(([date, count]) => (
                            <div className="daily-click-row" key={date}>
                              <span>{date}</span>
                              <strong>{count}</strong>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
