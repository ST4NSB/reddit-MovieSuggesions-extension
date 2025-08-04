# /r/MovieSuggestions extension

An extension for reddit to create an iMDb link to movies recommended in the MovieSuggestions sub-reddit  
Uses **OMDb API** to link the iMDb movie titles

**!! ONLY works for the old reddit theme (old.reddit.com/r/MovieSuggestions)**

# Installing

- Download the latest release
- Create an .env file containing OMDB_API_KEYS with your api key/s (separated with , for multiple keys) from OMDb like ex. OMDB_API_KEYS=hs4ddfd,rrisppsf
- Load the extension on your browser

# Movie Embeddeding from other's reply

## Example

### Without extension

<img width="208" height="88" alt="image" src="https://github.com/user-attachments/assets/b18e841d-f835-42ba-aa79-49e6dd0b9e47" />

### With extension

<img width="363" height="102" alt="image" src="https://github.com/user-attachments/assets/ac4c4564-db78-439f-ba12-60cc7951d91f" />

# Development progress

- [x] works for html paragraphs tag (p)
- [x] works for html list items tag (li)
- [x] separates movie title in Quotation mark (`".."`) from other texts
- [x] creates multiple links for every movie separated by new line(\n), horizontal space(\t) and comma (,)
- [x] separates movie title from other text when a character of this kind **([-/?—;~<>.** is found
- [x] doesn't link movies with a score < 200 of audience vote
- [x] doesn't create 2x links on list items with paragraph tag
- [x] removes '-' from the front of the paragraph -> ex. -The Dark Knight
- [x] added stop words list
- [x] not searching for titles length <= 1

# License

This project is licensed unde **MIT** [https://opensource.org/licenses/MIT/]
