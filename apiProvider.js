const baseUrl = "https://www.omdbapi.com/";

async function getEnvironmentVariables() {
  const response = await fetch(chrome.runtime.getURL(".env"));
  const text = await response.text();
  const env = Object.fromEntries(
    text.split("\r\n").map((line) => line.split("="))
  );
  return {
    OMDB_API_KEYS: env.OMDB_API_KEYS,
  };
}

async function fetchMovieImdbId(s, year = null) {
  const env = await getEnvironmentVariables();
  const apiKeys = env.OMDB_API_KEYS.split(",");

  for (const key of apiKeys) {
    try {
      const query = buildQueryString(key, s, year);
      const url = `${baseUrl}?${query}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "False") {
        console.error(`[OMDB API] Error: ${data.Error} (requested: ${url})`);

        if (data.Error === "Request limit reached!") {
          continue;
        } else {
          break;
        }
      }

      if (data.totalResults === "0") {
        console.error(`[OMDB API] No search results found for: "${url}"`);
        break;
      }

      const movieId = data.Search[0].imdbID; // Get the first movie's IMDb ID
      const title = data.Search[0].Title;

      let imdbPageRating = null;
      let imdbPageYear = null;
      try {
        const result = await getImdbRatingAndYear(movieId);
        imdbPageRating = result.rating;
        imdbPageYear = result.year;
      } catch (err) {
        console.error(`[getImdbRatingAndYear] Failed for ID ${movieId}:`, err);
      }

      return {
        title: title,
        imdbId: movieId,
        rating: imdbPageRating,
        year: imdbPageYear,
      };
    } catch (err) {
      console.error(`[OMDB API] Request failed with API key ${key}:`, err);
    }
  }

  console.error(`[OMDB API] All API keys exhausted or request failed.`);
  return null;
}

function buildQueryString(key, s, year) {
  const params = new URLSearchParams();

  params.append("type", "movie");
  if (s) {
    params.append("s", s);
  }
  if (year) {
    params.append("y", year);
  }
  if (key) {
    params.append("apikey", key);
  }

  return params.toString();
}

/**
 * Fetch IMDb rating and year by IMDb ID by scraping the IMDb page HTML
 * @param {string} imdbId e.g. "tt0111161"
 * @returns {Promise<{rating: string, year: string}>}
 */
async function getImdbRatingAndYear(imdbId) {
  if (!imdbId.startsWith("tt")) {
    throw new Error("Invalid IMDb ID format");
  }

  const url = `https://www.imdb.com/title/${imdbId}`;

  const response = await fetch(url, {
    headers: {
      "Accept-Language": "en-US,en;q=0.9", // To get consistent English content
      // User-Agent can't be set in browser fetch due to CORS and security,
      // but this usually works for IMDb
    },
    // mode: 'cors' by default in browser, should be fine for IMDb
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IMDb page: ${response.status}`);
  }

  const html = await response.text();

  // Parse the HTML text into a DOM Document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Extract rating: look for <span itemprop="ratingValue"> or other patterns
  // IMDb updated their markup, so use common CSS selectors observed:

  // Try to find rating span by itemprop or by other class selectors
  let rating =
    doc
      .querySelector(".rating-star > span:nth-child(2)")
      ?.textContent?.trim() ||
    doc
      .querySelector(
        'div[data-testid="hero-rating-bar__aggregate-rating__score"] > span'
      )
      ?.textContent?.trim() ||
    null;

  let year = doc.querySelector("title")?.textContent?.trim() || null;

  if (year) {
    year = extractYearFromText(year);
  }

  return { rating: rating, year: year };
}
