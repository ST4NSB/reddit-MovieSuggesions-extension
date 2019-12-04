# /r/MovieSuggestions extension

An extension for reddit to create an iMDb link to movies recommended in the MovieSuggestions sub-reddit  
Uses **OMDb API** to link the iMDb movie titles  

**!! ONLY works for the old reddit theme (old.reddit.com/r/MovieSuggestions)**

# 1. Movie Embedding from my reply
## Example
![Gif example with my reply](images/textarea_example.gif)

**!!! Currently works on *old.reddit.com/r/MovieSuggestions* sub-reddit ONLY!**

# 2. Movie Embeddeding from other's reply

## Example
### Without extension
![image example without extension](images/no_extension.png)
### With extension
![image example with extension](images/with_extension.png)

# Development progress
+ [x] works for html paragraphs tag (p)
+ [x] works for html list items tag (li)
+ [x] separates movie title in Quotation mark (`".."`) from other texts
+ [x] creates multiple links for every movie separated by new line(\n), horizontal space(\t) and comma (,)
+ [x] separates movie title from other text when a character of this kind **([-/?—;~<>.** is found
+ [x] doesn't link movies with a score < 200 of audience vote
+ [x] doesn't create 2x links on list items with paragraph tag
+ [x] removes '-' from the front of the paragraph -> ex. -The Dark Knight
+ [x] added stop words list
+ [x] not searching for titles length <= 1

# License
This project is licensed unde **MIT** [https://opensource.org/licenses/MIT/]
