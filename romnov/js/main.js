let imgGen = new RomanceCover("output", "controls", {
  width: 750,
  height: 1225
});

let loadBtn = new LoadImageButton("fileBtnEl");
loadBtn.imageLoadedCallback = function(file) {
  imgGen.setImage('main', file);
};

let controlEl = document.getElementById("controls");
/*
let input = new cbTextInput(controlEl, {label: 'name', default: "foo"});
*/

/*
let options = new ImageGeneratorInputGroup(imgGen, "controls");
console.log(options);
options.addTextOption('author', 'authorText', 'foo');
options.addTextOption('title', 'titleText', 'foobar');
*/

imgGen.data = {
  'authorText': 'Author name',
  'authorTextColor': '#bb3876',
  'titleText': 'title',
  'headerText': 'Romance Novel'
};


/*
imgGen.data = {
  'authorText': 'William Newby',
  'authorTextColor': '#bb3876',
  'titleText': 'what the parrot saw',
};
*/
