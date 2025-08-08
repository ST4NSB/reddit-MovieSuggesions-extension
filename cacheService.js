// Set cache expiration time in milliseconds (e.g., 4 days)
const CACHE_EXPIRATION_MS = 4 * 24 * 60 * 60 * 1000;

cleanExpiredImdbCache();

function buildCacheKey(s, year) {
  return `${s || ""}_${year || ""}`;
}

function setToLocalStorage(key, value) {
  const item = {
    value,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch {
    console.error(`Failed to set item in localStorage for key: ${key}`);
  }
}

function getFromLocalStorage(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp > CACHE_EXPIRATION_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    console.error(`Failed to parse item from localStorage for key: ${key}`);
    return null;
  }
}

function cleanExpiredImdbCache() {
  let cleanedCount = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = localStorage.getItem(key);
    if (!item) continue;
    try {
      const parsed = JSON.parse(item);
      if (
        parsed.value &&
        parsed.value.imdbId &&
        Date.now() - parsed.timestamp > CACHE_EXPIRATION_MS
      ) {
        localStorage.removeItem(key);
        cleanedCount++;
        // Adjust index since localStorage shrinks
        i--;
      }
    } catch {
      console.error(
        `[cleanExpiredImdbCache] Failed to parse item from localStorage for key: ${key}`
      );
    }
  }

  console.info(
    `[cleanExpiredImdbCache] Expired IMDb cache entries cleaned. Removed a total of ${cleanedCount} entries.`
  );
}
