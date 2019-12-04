
var timer;
var timerSet = false;
var txtArea = document.getElementsByTagName("TEXTAREA")[0];

txtArea.oninput = function (e) {
	if(!timerSet) {
		timer = setTimeout(searchForMovieWithAPI, 1700);
	}
	else {
		clearTimeout(timer);
	}
}

function searchForMovieWithAPI() {
	const apiKey = 'beefda61'; 
	let searchString = 'https://www.omdbapi.com/?apikey=';
	searchString += apiKey;
	searchString += '&t='; // title of the movie
		
	let movieTitle = "";
	let index = 0;
	for(let i = 0; i < txtArea.value.length - 1; i++)
		if(txtArea.value[i] == '\n' && txtArea.value[i + 1] == '\n')
			index = i + 2;
	
	for(let i = index; i < txtArea.value.length; i++)
		movieTitle += txtArea.value[i];
	if(movieTitle.length > 3) {
		console.log("Movie searched: " + movieTitle);
		searchString += movieTitle;
		fetchAsyncTextArea(searchString);
	}
}

async function fetchAsyncTextArea (url) {
	let response = await fetch(url);
	let data = await response.json().then(data => ({
		data: data,
		status: response.status
	}) ).then(res => {
		if(res.data.Response == 'False') return;
		if(res.data.imdbVotes < 1000 || res.data.imdbVotes === 'N/A') return;
		let imdbTitle = res.data.Title;
		let imdbId = res.data.imdbID;
		createTextAreaLink(imdbTitle, imdbId);
	}); 
}

let movieSearchedList = [];
function createTextAreaLink(imdbTitle, imdbId) {
	console.log(imdbTitle);
	
	if(movieSearchedList.indexOf(imdbId) == -1 ) {
		movieSearchedList.push(imdbId);
	}
	else return;
	
	console.log("list: " + movieSearchedList);
	
	let imdbLink = 'https://www.imdb.com/title/';
	imdbLink += imdbId;
	
	let fullAppendMaterial = "[" + imdbTitle + "](" + imdbLink + ")\n\n";
	
	let txtBoxValue = txtArea.value;
	let index = -1;
	let newContent = "";
	for(let i = txtBoxValue.length - 1; i >= 1; i--)
		if(txtBoxValue[i] == '\n' && txtBoxValue[i - 1] == '\n') {
			index = i;
			break;
		}
	for(let i = 0; i <= index; i++)
		newContent += txtBoxValue[i];
	
	txtArea.value = newContent;
	txtArea.value += fullAppendMaterial;
}
