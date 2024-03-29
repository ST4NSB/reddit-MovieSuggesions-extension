/* SUPPORTS ONLY https://old.reddit.com/r/MovieSuggestions/ */

let posts = document.getElementsByClassName('sitetable nestedlisting')[0];
createImdbLinks();

function createImdbLinks() {
	let postsLength = posts.getElementsByClassName('md').length;
	for(let i = 0; i < postsLength; i++) {
		let comment = posts.getElementsByClassName('md')[i]; // reply post div class
		checkTitleListTag(comment, i); // check in <li>..</li>
		checkTitleParagraphTag(comment, i); // check in <p>..</p>
	}
}

function checkTitleListTag(postComment, postCommentIndex) {
	let postCommentLength = postComment.getElementsByTagName('li').length;
	for(let i = 0; i < postCommentLength; i++) {
		let liChild = postComment.getElementsByTagName('li')[i];
	
		if(liChild.firstChild.nodeType == Node.TEXT_NODE) {
			let listItem = postComment.getElementsByTagName('li')[i].textContent;
			//console.log(listItem);
			clearParagraph(listItem, 'li', postCommentIndex, i);	
		}
		
	}
}

function checkTitleParagraphTag(postComment, postCommentIndex) {
	let postCommentLength = postComment.getElementsByTagName('p').length;
	for(let i = 0; i < postCommentLength; i++) {
		let paragraph = postComment.getElementsByTagName('p')[i].textContent;
		//console.log(paragraph);
		clearParagraph(paragraph, 'p', postCommentIndex, i);	
	}
}




function clearParagraph(paragraph, tagName, classIndex, tagIndex) {
	const apiKey = 'beefda61'; 
	
	let wordsArray = createWordsArrayFromSeparators(paragraph);
	wordsArray.forEach(function(sentence) {
		//console.log(sentence);
		let searchString = 'https://www.omdbapi.com/?apikey=';
		searchString += apiKey;
		searchString += '&t='; // title of the movie
		
		let movieTitle = removeAfterSeparators(sentence);
		movieTitle = checkQuotationMarks(movieTitle);
		if(movieTitle.length <= 1) return;
		if(isTitleStopWord(movieTitle)) return;
		
		//console.log(movieTitle);
		searchString += movieTitle;
		fetchAsync(searchString, movieTitle, tagName, classIndex, tagIndex);
	});
}

function createWordsArrayFromSeparators(paragraph) {
	let words = [];
	let word = '';
	for(let i = 0; i < paragraph.length; i++) {
		if(hasSentenceSeparator(paragraph[i])) {
			words.push(word);
			word = '';
			if(paragraph[i + 1] === ' ')
				i++;
		}
		else 
			word += paragraph[i];
	}
	if(word != '')
		words.push(word);
	return words;
}

function hasSentenceSeparator(paragraphChar) {
	const separators = '\n\t,.&*'; 
	return separators.includes(paragraphChar);
}

function removeAfterSeparators(paragraph) {
	let movieTitle = '';
	for(let i = 0; i < paragraph.length; i++) {
		if(i == 0 && hasSeparator(paragraph[i]))
			continue;
		if(hasSeparator(paragraph[i]))
			break;
		movieTitle += paragraph[i];
	}
	return movieTitle;
}

function hasSeparator(paragraphChar) {
	const separators = '([=-/?—;~<>.”'; 
	return separators.includes(paragraphChar);
}

function checkQuotationMarks(title) {
	let movieTitle = '', quotationSignFound = false;
	for(let i = 0; i < title.length; i++) {
		if(quotationSignFound)
			movieTitle += title[i];
		if(isQuotationMark(title[i]) && quotationSignFound) 
			return movieTitle;
		if(isQuotationMark(title[i]) && !quotationSignFound) 
			quotationSignFound = true;
	}
	return title;
}

function isQuotationMark(titleChar) {
	const quotation = '\`\"\“\”';
	return quotation.includes(titleChar);
}

function isTitleStopWord(movieTitle) {
	let stopWords = [
		"this", "this!", "yes", "yes!", "maybe", "hi", "hi!",
		"no", "no!", "but", "com", "agreat", "thx", "i", "rel",
		"canyou", "what", "thankyou", "thankyou!", "lol", 
		"mr", "right", "youknow", "sure", "be", "also", "to",
		"that", "please", "seenit", "god", "yeah", "oh", "want",
		"notamovie", "thanks", "thank", "thankyou!!", "href", "a",
		"thankyou!!!", "so", "sad", "thecharacters", "perfect",
		"can'tdoit", "ah", "too", "http", "www", "really", "https"];
	let noSpace = movieTitle.replace(/\s/g, ""); // replaces white-space with ""
	let mvTitle = noSpace.toLowerCase();
	let result = false;
	stopWords.forEach(function(item) {
		if(mvTitle === item)
			result = true;
	});
	return result;
}

async function fetchAsync (url, movieTitle, tagName, classIndex, tagIndex) {  
    let response = await fetch(url);
	let data = await response.json().then(data => ({
		data: data,
		status: response.status
	}) ).then(res => {
		if(res.data.Response == 'False') return;
		if(res.data.imdbVotes < 250 || res.data.imdbVotes === 'N/A') return;
		let imdbLink = res.data.imdbID;
		createLink(imdbLink, movieTitle, tagName, classIndex, tagIndex);
	}); 
}

function cleanTitleWhitespaces(str) {
	return str.replace(/\s*$/,""); 
}

function createLink(link, movieTitle, tagName, classIndex, tagIndex) {	
	let imdblink = 'https://www.imdb.com/title/';
	imdblink += link;
	actualPost = posts.getElementsByClassName('md')[classIndex].getElementsByTagName(tagName)[tagIndex]; 
	
	console.log(movieTitle);
	console.log(actualPost.innerHTML);
	
	mvt = cleanTitleWhitespaces(movieTitle);
	let movieWithLink = mvt + '<a target="_blank" class="imdb_link" href ="' + imdblink + '">IMDb</a>';
	actualPost.innerHTML = actualPost.innerHTML.replace(mvt, movieWithLink);
}
