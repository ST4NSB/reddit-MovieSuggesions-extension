/* SUPPORTS ONLY https://old.reddit.com/r/MovieSuggestions/ */

let posts = document.getElementsByClassName("sitetable nestedlisting")[0];
createImdbLinks();

function createImdbLinks() {
  const commentElements = posts.getElementsByClassName("md");
  const numberOfComments = commentElements.length;

  for (let commentIndex = 0; commentIndex < numberOfComments; commentIndex++) {
    const commentElement = commentElements[commentIndex];

    handleListItems(commentElement, commentIndex);
    handleParagraphs(commentElement, commentIndex);
  }
}

function handleListItems(commentElement, commentIndex) {
  const listItems = commentElement.getElementsByTagName("li");
  const numberOfListItems = listItems.length;

  for (let itemIndex = 0; itemIndex < numberOfListItems; itemIndex++) {
    const listItem = listItems[itemIndex];

    if (listItem.firstChild.nodeType === Node.TEXT_NODE) {
      const listItemText = listItem.textContent;
      getAndCreateMovieLink(listItemText, "li", commentIndex, itemIndex);
    }
  }
}

function handleParagraphs(commentElement, commentIndex) {
  const paragraphs = commentElement.getElementsByTagName("p");
  const numberOfParagraphs = paragraphs.length;

  for (
    let paragraphIndex = 0;
    paragraphIndex < numberOfParagraphs;
    paragraphIndex++
  ) {
    const paragraphText = paragraphs[paragraphIndex].textContent;
    getAndCreateMovieLink(paragraphText, "p", commentIndex, paragraphIndex);
  }
}

function getAndCreateMovieLink(paragraph, tagName, classIndex, tagIndex) {
  let sentences = createSentencesFromSeparators(paragraph);

  for (let sentence of sentences) {
    let movieTitle = removeAfterSeparators(sentence);
    movieTitle = checkQuotationMarks(movieTitle);
    movieTitle = movieTitle.trim();
    const year = extractYearFromText(sentence);

    if (movieTitle.length <= 1) {
      continue;
    }

    if (isTitleStopWord(movieTitle)) {
      continue;
    }

    console.log(
      `[movie-suggestion-extension - content.js] Processing movie title: "${movieTitle}" (year: ${year})`
    );

    fetchMovieImdbId(movieTitle, year)
      .then((data) => {
        if (data) {
          console.log(
            `[movie-suggestion-extension - content.js] Fetched IMDb data for movie "${movieTitle}"`,
            data
          );

          if (data.imdbId) {
            AddLinkToMovieInUserComment(
              data.imdbId,
              data.rating,
              year ? null : data.year,
              movieTitle,
              tagName,
              classIndex,
              tagIndex
            );
          }
        }
      })
      .catch((err) => {
        console.error(
          "[movie-suggestion-extension - content.js] Unexpected error when calling fetchMovieImdbId:",
          err
        );
      });
  }
}

function AddLinkToMovieInUserComment(
  id,
  rating,
  year,
  movieTitle,
  tagName,
  classIndex,
  tagIndex
) {
  let imdblink = "https://www.imdb.com/title/";
  imdblink += id;

  actualPost = posts
    .getElementsByClassName("md")
    [classIndex].getElementsByTagName(tagName)[tagIndex];

  let imdbText = "IMDb";
  if (rating) {
    imdbText += ` - ${rating}`;
  }
  if (year) {
    imdbText += ` (${year})`;
  }

  const ratingCssStyle = getRatingStyle(rating);
  const styleAttr = ratingCssStyle
    ? `style="background-color: ${ratingCssStyle.backgroundColor}; color: ${ratingCssStyle.color} !important;"`
    : "";

  let movieWithLink =
    movieTitle +
    `<a target="_blank" class="imdb_link" ${styleAttr} href="${imdblink}">${imdbText}</a>`;

  actualPost.innerHTML = actualPost.innerHTML.replace(
    movieTitle,
    movieWithLink
  );
}
