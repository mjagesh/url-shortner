import { useState } from "react";
import { createShortUrl } from "../services/urlService";

const Home = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShortUrl("");

      const response = await createShortUrl(url);

      setShortUrl(response.data.shortUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home">
      <div className="container">
        <h1>URL Shortener</h1>

        <p className="subtitle">Shorten your long URLs quickly and easily.</p>

        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="url"
            placeholder="Enter your long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL</p>

            <div className="short-url">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(shortUrl)}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
