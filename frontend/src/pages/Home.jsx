import { useState } from "react";

const Home = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      return;
    }

    // Temporary result.
    // Backend integration will be added later.
    setShortUrl("https://short.ly/aB72xK");
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

          <button type="submit">Shorten URL</button>
        </form>

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL</p>

            <div className="short-url">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>

              <button type="button">Copy</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
