const URLS_TO_FIND = {
	'https://twitter.com/thecryptodog': 2,
	'http://www.catster.com/cats-101/all-about-pixiebob-cats': 1,
	'https://www.dining-out.co.za/md/Foo-Bar-Cafe/7918': 4,
	'https://www.petcha.com/what-you-need-to-know-about-parrot-feet/': 3,
};

let urlsFound = [0,0,0,0];

let canvas = null;
let ctx = null;
let timer = null;

function init() {
	canvas = document.getElementById('feedback');
	ctx = canvas.getContext('2d');

	document.body.addEventListener('DOMSubtreeModified', () => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(checkURLs, 1000);
	}, false);

	drawFeedback();
}

function drawFeedback() {
	ctx.clearRect(0, 0, 800, 40);

	for (let i=0; i < urlsFound.length; i++)
	{
		if (urlsFound[i]) {
			ctx.fillStyle = "#0f0";
		} else {
			ctx.fillStyle = "#000";
		}

		ctx.fillRect(i*40+5, 5, 30, 30);
	}

}


function checkURLs() {
	console.log('CHECKING URLS');

	let linkElements = $("a.gs-image");

	let aEl;

	let linkEls = $("a.gs-image");
	
	linkElements.each(function(index) {
		let url = $(this).attr('href');
		console.log(url);
		if (URLS_TO_FIND[url]) {
			let foundIndex = URLS_TO_FIND[url] - 1;
			urlsFound[foundIndex] = 1;
			console.log('FOUND ' + foundIndex);
		}

	});

	drawFeedback();

	clearTimeout(timer);
}

init();


