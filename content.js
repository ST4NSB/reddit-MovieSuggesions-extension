/* SUPPORTS ONLY old.reddit.com */

let posts = document.getElementsByClassName('sitetable nestedlisting')[0];
createImdbLinks();

function createImdbLinks() {
	let postsLength = posts.getElementsByClassName('md').length;
	for(let i = 0; i < postsLength; i++) {
		let comment = posts.getElementsByClassName('md')[i]; // reply post div class
		checkTitleParagraphTag(comment, i);
		checkTitleListTag(comment, i);
	}
}

function checkTitleParagraphTag(postComment, postCommentIndex) {
	let postCommentLength = postComment.getElementsByTagName('p').length;
	for(let i = 0; i < postCommentLength; i++) {
		let paragraph = postComment.getElementsByTagName('p')[i].textContent;
		clearParagraph(paragraph, 'p', postCommentIndex, i);	
	}
}

function checkTitleListTag(postComment, postCommentIndex) {
	let postCommentLength = postComment.getElementsByTagName('li').length;
	for(let i = 0; i < postCommentLength; i++) {
		let listItem = postComment.getElementsByTagName('li')[i].textContent;
		clearParagraph(listItem, 'li', postCommentIndex, i);	
	}
}




function clearParagraph(paragraph, tagName, classIndex, tagIndex) {
	const apiKey = 'beefda61'; 
	let searchString = 'https://www.omdbapi.com/?apikey=';
	searchString += apiKey;
	searchString += '&t='; // title of the movie
	
	let movieTitle = removeAfterSeparators(paragraph);
	movieTitle = checkQuotationMarks(movieTitle);
	
	searchString += movieTitle;	
	fetchAsync(searchString, tagName, classIndex, tagIndex);
}

function removeAfterSeparators(paragraph) {
	let movieTitle = '';
	for(let i = 0; i < paragraph.length; i++) {
		if(hasSeparator(paragraph[i]))
			break;
		movieTitle += paragraph[i];
	}
	return movieTitle;
}

function hasSeparator(paragraphChar) {
	const separators = '([-/?—.;'; 
	return separators.includes(paragraphChar);
}

function checkQuotationMarks(title) {
	let movieTitle = '', found = false;
	for(let i = 0; i < title.length; i++) {
		if(found)
			movieTitle += title[i];
		if(title[i] == '\"' && found) 
			return movieTitle;
		if(title[i] == '\"' && !found) 
			found = true;
	}
	return title;
}




async function fetchAsync (url, tagName, classIndex, tagIndex) {
	let response = await fetch(url);
	let data = await response.json().then(data => ({
		data: data,
		status: response.status
	}) ).then(res => {
		if(res.data.Response == 'False') return;
		let imdbLink = res.data.imdbID;
		createLink(imdbLink, tagName, classIndex, tagIndex);
	});
}

function createLink(link, tagName, classIndex, tagIndex) {
	let a = document.createElement('a');
	let linkText = document.createTextNode('IMDb');
	a.appendChild(linkText);
	let imdblink = 'https://www.imdb.com/title/';
	imdblink += link;
	a.href = imdblink;
	a.className  = 'imdb_link';
	a.target = '_blank';
	posts.getElementsByClassName('md')[classIndex].getElementsByTagName(tagName)[tagIndex].appendChild(a);
}
