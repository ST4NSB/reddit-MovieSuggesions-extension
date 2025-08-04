const baseUrl = "https://www.omdbapi.com/";
const filterOnlyMovies = true;
const enableScraping = true;

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

function buildQueryString(key, s = null, i = null, year = null) {
  const params = new URLSearchParams();

  if (filterOnlyMovies) {
    params.append("type", "movie");
  }
  if (i) {
    params.append("i", i);
  }
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

async function fetchMovieImdbId(s, year = null) {
  const env = await getEnvironmentVariables();
  const apiKeys = env.OMDB_API_KEYS.split(",");

  for (let [i, key] of apiKeys.entries()) {
    try {
      const query = buildQueryString(key, s, null, year);
      const url = `${baseUrl}?${query}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "False") {
        if (data.Error === "Request limit reached!") {
          // Only log if this is the last API key
          if (i === apiKeys.length - 1) {
            console.error(
              `[OMDB API] Error: ${data.Error} (requested: ${url})`
            );
          }
          continue;
        } else {
          console.error(`[OMDB API] Error: ${data.Error} (requested: ${url})`);
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
        let result = await getImdbRatingAndYearByApi(movieId);
        if (!result && enableScraping) {
          result = await getImdbRatingAndYearByScraping(movieId);
        }
        imdbPageRating = result.rating;
        imdbPageYear = result.year;

        if (imdbPageRating === "N/A") {
          imdbPageRating = null;
        }
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

  return null;
}

async function getImdbRatingAndYearByScraping(imdbId) {
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

async function getImdbRatingAndYearByApi(imdbId) {
  if (!imdbId.startsWith("tt")) {
    throw new Error("Invalid IMDb ID format");
  }

  const env = await getEnvironmentVariables();
  const apiKeys = env.OMDB_API_KEYS.split(",");

  for (let [i, key] of apiKeys.entries()) {
    try {
      const query = buildQueryString(key, null, imdbId, null);
      const url = `${baseUrl}?${query}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "False") {
        if (data.Error === "Request limit reached!") {
          // Only log if this is the last API key
          if (i === apiKeys.length - 1) {
            console.error(
              `[OMDB API] Error: ${data.Error} (requested: ${url})`
            );
          }
          continue;
        } else {
          console.error(`[OMDB API] Error: ${data.Error} (requested: ${url})`);
          break;
        }
      }

      return {
        rating: data.imdbRating,
        year: data.Year,
      };
    } catch (err) {
      console.error(`[OMDB API] Request failed with API key ${key}:`, err);
    }
  }

  return null;
}
