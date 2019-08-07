const apiKey = 'beefda61'; 
let posts = document.getElementsByClassName('sitetable nestedlisting')[0];
createImdbLinks();

function createImdbLinks() {
	let postsLength = posts.getElementsByClassName('md').length;
	
	for(let i = 0; i < postsLength; i++) {
		let comment = posts.getElementsByClassName('md')[i];
		let commentLength = comment.getElementsByTagName('p').length;
		for(let j = 0; j < commentLength; j++) {
			let paragraph = comment.getElementsByTagName('p')[j].textContent;
			clearParagraph(paragraph, i, j);	
		}
	}
}

function clearParagraph(paragraph, classIndex, tagIndex) {
	let searchString = 'https://www.omdbapi.com/?apikey=';
	searchString += apiKey;
	searchString += '&t='; // title of the movie
	
	let movie = '';
	for(let i = 0; i < paragraph.length; i++) {
		if(hasSeparator(paragraph[i]))
			break;
		movie += paragraph[i];
	}
	
	searchString += movie;
	fetchAsync(searchString, classIndex, tagIndex);
}

function hasSeparator(paragraphChar) {
	const separators = "([-"; 
	return separators.includes(paragraphChar);
}

async function fetchAsync (url, classIndex, tagIndex) {
	let response = await fetch(url);
	let data = await response.json().then(data => ({
		data: data,
		status: response.status
	}) ).then(res => {
		if(res.data.Response == "False") return;
		let imdbLink = res.data.imdbID;
		createLink(imdbLink, classIndex, tagIndex);
	});
}

function createLink(link, classIndex, tagIndex) {
	let a = document.createElement('a');
	let linkText = document.createTextNode(" (IMDb)");
	a.appendChild(linkText);
	let imdblink = 'https://www.imdb.com/title/';
	imdblink += link;
	a.href = imdblink;
	posts.getElementsByClassName('md')[classIndex].getElementsByTagName('p')[tagIndex].appendChild(a);
}
