// Set cache expiration time in milliseconds (e.g., 4 days)
const CACHE_EXPIRATION_MS = 4 * 24 * 60 * 60 * 1000;

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
