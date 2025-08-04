function getRatingStyle(rating) {
  const r = parseFloat(rating);
  if (isNaN(r)) {
    return null;
  }

  if (r >= 8.3) {
    return { backgroundColor: "#26a65b", color: "white" }; // Very Good - Emerald Green
  } else if (r >= 7.8) {
    return { backgroundColor: "#6ede9c", color: "black" }; // Good - Light Green
  } else if (r >= 7.0) {
    return { backgroundColor: "#f1c40f", color: "black" }; // Average - Yellow
  } else if (r >= 6.0) {
    return { backgroundColor: "#e67e22", color: "white" }; // Low - Orange
  } else {
    return { backgroundColor: "#c0392b", color: "white" }; // Bad - Red
  }
}

function extractYearFromText(text) {
  const match = text.match(/\((\d{4})\)/);
  if (match) {
    return match[1]; // returns just the year string like "1987"
  }

  return null;
}

function cleanTitleWhitespaces(str) {
  return str.replace(/\s*$/, "");
}

function hasSentenceSeparator(paragraphChar) {
  const separators = "\n\t,.&*";
  return separators.includes(paragraphChar);
}

function isQuotationMark(titleChar) {
  const quotation = '`"“”';
  return quotation.includes(titleChar);
}

function hasSeparator(paragraphChar) {
  const separators = "([=-/?—;~<>.”";
  return separators.includes(paragraphChar);
}

function createSentencesFromSeparators(paragraph) {
  let words = [];
  let word = "";
  for (let i = 0; i < paragraph.length; i++) {
    if (hasSentenceSeparator(paragraph[i])) {
      words.push(word);
      word = "";
      if (paragraph[i + 1] === " ") i++;
    } else word += paragraph[i];
  }
  if (word !== "") words.push(word);

  return words;
}

function removeAfterSeparators(paragraph) {
  let movieTitle = "";
  for (let i = 0; i < paragraph.length; i++) {
    if (i == 0 && hasSeparator(paragraph[i])) continue;
    if (hasSeparator(paragraph[i])) break;
    movieTitle += paragraph[i];
  }

  return movieTitle;
}

function checkQuotationMarks(title) {
  let movieTitle = "",
    quotationSignFound = false;

  for (let i = 0; i < title.length; i++) {
    if (quotationSignFound) movieTitle += title[i];
    if (isQuotationMark(title[i]) && quotationSignFound) return movieTitle;
    if (isQuotationMark(title[i]) && !quotationSignFound)
      quotationSignFound = true;
  }

  return title;
}

const stopWords = [
  "this",
  "this!",
  "yes",
  "yes!",
  "maybe",
  "hi",
  "hi!",
  "no",
  "no!",
  "but",
  "com",
  "agreat",
  "thx",
  "i",
  "rel",
  "canyou",
  "what",
  "thankyou",
  "thankyou!",
  "lol",
  "mr",
  "right",
  "youknow",
  "sure",
  "be",
  "also",
  "to",
  "that",
  "please",
  "seenit",
  "god",
  "yeah",
  "oh",
  "want",
  "notamovie",
  "thanks",
  "thank",
  "thankyou!!",
  "href",
  "a",
  "thankyou!!!",
  "so",
  "sad",
  "thecharacters",
  "perfect",
  "can'tdoit",
  "ah",
  "too",
  "http",
  "www",
  "really",
  "https",
  "okay",
  "ok",
  "ok!",
  "wow",
  "nice",
  "cool",
  "amazing",
  "great",
  "bad",
  "good",
  "love",
  "hate",
  "maybe",
  "awesome",
  "meh",
  "sure",
  "bro",
  "dude",
  "guys",
  "girl",
  "man",
  "woman",
  "they",
  "he",
  "she",
  "we",
  "me",
  "my",
  "mine",
  "your",
  "yours",
  "our",
  "ours",
  "his",
  "hers",
  "its",
  "their",
  "theirs",
  "someone",
  "everyone",
  "nobody",
  "anyone",
  "hey",
  "hello",
  "bye",
  "goodbye",
  "yep",
  "nope",
  "idk",
  "imo",
  "imho",
  "lmao",
  "rofl",
  "brb",
  "gtg",
  "tbh",
  "fyi",
  "btw",
  "u",
  "ur",
  "r",
  "is",
  "was",
  "are",
  "am",
  "do",
  "does",
  "did",
  "have",
  "has",
  "had",
  "will",
  "would",
  "should",
  "could",
  "can't",
  "won't",
  "don't",
  "didn't",
  "ain't",
  "it's",
  "he's",
  "she's",
  "they're",
  "we're",
  "you're",
  "i'm",
  "that's",
  "there",
  "here",
  "where",
  "when",
  "how",
  "why",
  "which",
  "if",
  "and",
  "or",
  "an",
  "the",
  "in",
  "on",
  "at",
  "for",
  "with",
  "of",
  "by",
  "about",
  "into",
  "out",
  "up",
  "down",
  "as",
  "from",
  "over",
  "under",
  "again",
  "ever",
  "always",
  "never",
  "some",
  "any",
  "most",
  "few",
  "lot",
  "lots",
  "more",
  "less",
  "same",
  "new",
  "old",
  "fun",
  "boring",
  "thing",
  "stuff",
  "anything",
  "kinda",
  "sorta",
  "just",
  "only",
  "even",
  "maybe",
  "though",
  "y'all",
  "removed]",
];

function isTitleStopWord(movieTitle) {
  let noSpace = movieTitle.replace(/\s/g, ""); // replaces white-space with ""
  let mvTitle = noSpace.toLowerCase();
  let result = stopWords.some(function (item) {
    return mvTitle === item;
  });

  return result;
}
