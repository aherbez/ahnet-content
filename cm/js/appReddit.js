var app = angular.module('appReddit', []);

app.controller('RedditCtrl', [
	'$scope',
	function($scope) {

		$scope.showDrop = false;


		$scope.clickPost = function(row)
		{
			// alert('CLICKED ON ' + row);
		}

		$scope.absorb = function(post)
		{
			// alert(post.title);
			responsiveVoice.speak(post.title, 'UK English Male', {rate: 0.75, onend: function() {
				alert('done');
			}});
		}

		$scope.toggleDropdown = function()
		{
			alert('toggle');
			$scope.showDrop = !$scope.showDrop;
		}

		$scope.tryLogin = function()
		{
			var username = 'foo';
			if ($scope.loginUsername && $scope.loginUsername != '')
			{
				username = $scope.loginUsername;
			}

			var msg = '';
			for (i=0; i<loginMessages.length; i++)
			{
				if (username == loginMessages[i].name)
				{
					msg = loginMessages[i].response;
				}
			}

			if (msg != '')
			{
				responsiveVoice.speak(msg);
			}

			// responsiveVoice.speak('login ' + username);
		}


	}]);

app.factory('posts', [function() {
	// service body
	var o = {
		posts: []
	};
	return o;
}])


var loginMessages = [
	{"name": "foo", "response": "bar"},
	{"name": "hello", "response": "world"},
	{"name": "HAL", "response": "I can't do that"}
];

var ads = [
	{"img": "trashmorphers.jpg", "link": ""},
	{"img": "aliens.jpg", "link": ""},
	{"img": "greys50.jpg", "link": ""},
	{"img": "millers.jpg", "link": ""}
];

var trending = ['Nowology','teleporterthoughts', 'LeWrongRegeneration', 'blackholeporn', 'DebateAJedi'];
var subreddits = ['artificiallifeprotips','projections','consciousnesspool','jeneticjerks','shamecollective','explainitlikeimafiremite'];


var posts = [
{"upvotes":621, "title": "I finally got all my firemites to sit together for a family photo. Love them lil buggers.", "username": "Auronlover", "sub": "awwwwwwwwwwwwwwww", "cycles": 5, "contribs": 510, "img": "post0"},
{"upvotes":463, "title": "this madness has been brought to you by", "username": "MegaDittoX", "sub": "AMA", "cycles": 5, "contribs": 273, "img": "post1"},
{"upvotes":413, "title": "How to use a Neg Ray to force the FireMite Fractemales to lavish us with quiet whispered compliments of strength and attractiveness!", "username": "LeDarkMercurian", "sub": "TheGreenCapsule", "cycles": 5, "contribs": 12, "img": "post2"},
{"upvotes":7821, "title": "AMA request: Bruxillian Digestion Slugs currently controlling someone else's body, what's the longest you've gone feeding on the thoughts of the weak without getting caught? ", "username": "NerfHerder", "sub": "AMArequests", "cycles": 5, "contribs": 42, "img": "post3"},
{"upvotes":898, "title": "Human who first predicted The Singularity was run over only hours before the event occurred by an artifical intelligence vehicle built by his own company.", "username": "TinfoilHeatShield", "sub": "ContinuumConspiraacies", "cycles": 5, "contribs": 697, "img": "post4"},
{"upvotes":237, "title": "Quantum Truthers blast the \"Panic Mongering Radicals\" of the Survival Council for promoting discredited claims of material limits to our universe'", "username": "BluePlanet", "sub": "politics", "cycles": 2, "contribs": 47, "img": "post5"},
{"upvotes":15, "title": "Survival Council warns that organisms have now already consumed 92.37% of all remaining resources left in the entire universe. ", "username": "sdv80", "sub": "Universe", "cycles": 2, "contribs": 89, "img": "post6"},
{"upvotes":6489, "title": "My dead girlfriend's MindBox account keeps sending me creepy holographic projections from an alternate dimension.", "username": "PocketWhaleFan88", "sub": "NoSleep", "cycles": 5, "contribs": 923, "img": "post7"},
{"upvotes":521, "title": "TIG: before the invention of humane Indigent Incinerators, people had to awkwardly step over impoverished human lifeforms on the streets while waiting for them to die.", "username": "G1G0L0J0E", "sub": "TodayIGrokked", "cycles": 11, "contribs": 12, "img": "post8"},
{"upvotes":149, "title": "Guess who I met yesterday at the spaceport!!! Even let me take a projection!", "username": "ChronissLover2", "sub": "ChronissTheTravelerFans", "cycles": 5, "contribs": 54, "img": "post9"},
{"upvotes":372, "title": "DNA test reveals ancient watery Earth shrine where early humans would deposit loved one's remains.  Nearby tissue dispenser for mourning loved ones to dry their tears.", "username": "Bones", "sub": "archaeology", "cycles": 5, "contribs": 89, "img": "post10"},
{"upvotes":348, "title": "If Arkellian Energy Ribbons became ominpotent, why didnÕt they just weaken the causality conditions of spacetime until the moment before they heard the punchline to the Riddle of Universal Torment?", "username": "dcj90", "sub": "teleporterthoughts", "cycles": 5, "contribs": 92, "img": "post11"},
{"upvotes":1048, "title": "JusticeEnforcementTroops claim entire population of planet was reaching for their singularity cannon when they were forced to exterminate", "username": "murphcooper", "sub": "BadEnforcerNoPlasma", "cycles": 5, "contribs": 102, "img": "post12"},
{"upvotes":6912, "title": "Projection of my friend poking a cranky synthoid queen's chamber with a stick", "username": "QuantumTruth", "sub": "painfuldeaths", "cycles": 5, "contribs": 640, "img": "post13"},
{"upvotes":116, "title": "Disney acquires rights to The Bible. Promises 3 new chapters next cycle.  Everything after Mormonism no longer canon. Boba Fett crossover in works.", "username": "harkness", "sub": "BestofHoloflix", "cycles": 8, "contribs": 42, "img": "post14"},
{"upvotes":158, "title": "NEW SUBBREDDIT: /r/ShameSingularity - all humiliation across the universe will be transcendently absorbed, experienced and shared in total. Join us. [formerly r/cringe]", "username": "IFeelYourPain", "sub": "newsubreddits", "cycles": 11, "contribs": 24, "img": "post15"},
{"upvotes":423, "title": "Jurassic Planet XVII: how does this tourist-dinosaur venture keep getting investors? ", "username": "singuhilarity", "sub": "Projections", "cycles": 5, "contribs": 349, "img": "post16"},
{"upvotes":63, "title": "Help! I traveled back in time to Ancient Earth and triggered something fucked up in the early 21st century time continuum.", "username": "spacedrunk", "sub": "advice", "cycles": 5, "contribs": 29, "img": "post17"},
{"upvotes":381, "title": "Quantum Truthers demand offspring no longer be taught the theory of gravity", "username": "0sd90821328", "sub": "politics", "cycles": 2, "contribs": 343, "img": "post18"},
{"upvotes":204, "title": "IÕve decided to molt with my best friend this year!", "username": "xenomorph", "sub": "FiveYChromosomes", "cycles": 5, "contribs": 119, "img": "post19"},
{"upvotes":2, "title": "XenonianCorp Is Your Friend. We Do Not Find You Delicious. ", "username": "XenonianCorp", "sub": "NSORED", "cycles": 5, "contribs": 391, "img": "post20"},
{"upvotes":5792, "title": "TIG: the Heisenberg Uncertainty principle was named for an Ancient Americas chemistry teacher who first discovered it.Ê", "username": "smarterthanu", "sub": "TodayIGrokked", "cycles": 5, "contribs": 776, "img": "post21"},
{"upvotes":2348, "title": "How to lower defense grids of uppity Taursus Omegas that wonÕt let you inject your neural chord into their cerebral cortex chambers", "username": "LeDarkMercurian", "sub": "TheGreenCapsule", "cycles": 5, "contribs": 1208, "img": "post22"},
{"upvotes":591, "title": "[projection] JusticeEnforcement Troops claim terminated colony was  \"resisting\" submission", "username": "2Fast2Fusion", "sub": "BadEnforcerNoPlasma", "cycles": 51, "contribs": 199, "img": "post23"},
{"upvotes":18, "title": "Survival Council warns organisms have consumed over half of all remaining energy resources in universe. ", "username": "robbytherobot", "sub": "Universe", "cycles": 92, "contribs": 125, "img": "post24"},
{"upvotes":0, "title": "123M", "username": "deleted", "sub": "", "cycles": 5, "contribs": 13, "img": "post25"},
{"upvotes":7239, "title": "I may not have anything above the neck, but I\'m sure you\'ll enjoy my other [P]arts", "username": "ThrowMyHeadAway", "sub": "GoneHeadless", "cycles": 5, "contribs": 1283, "img": ""},
{"upvotes":9, "title": "FAREWELL.", "username": "H1379g", "sub": "news", "cycles": 5, "contribs": 22, "img": ""},
{"upvotes":83, "title": "I was into FireMites before they existed", "username": "SkinnyGenes", "sub": "ChronoHipsters", "cycles": 1, "contribs": 300, "img": "post26"},
{"upvotes":539, "title": "Exterminate FireMites For Violating the Laws of Entropy! Don\'t Stand These Lazy Parasites!!!!!!!", "username": "QUANTEMTRUTH4EVAR!!!!!!1", "sub": "NSORED", "cycles": 5, "contribs": 73, "img": "post27"},
{"upvotes":106, "title": "Remote mining outpost makes second discovery of ancient astronaut found floating in deep space.", "username": "DrillOffspringDrill", "sub": "AsteroidMiners", "cycles": 5, "contribs": 98, "img": "post28"},
{"upvotes":123, "title": "[TRIGGER WARNING] be careful with misfires on Mark 7 laser triggers.", "username": "cj929akl_12k", "sub": "Blasters", "cycles": 5, "contribs": 91, "img": "post29"},
{"upvotes":681, "title": "Federation Bridge lens records drunk Centaurian asteroid collision. Warning: Space Gore ", "username": "SpacesuitFart", "sub": "WTF", "cycles": 5, "contribs": 82, "img": "post30"},
{"upvotes":9231, "title": "Heard you fellas donÕt even need a pretty f[A]ce to look at. ", "username": "NothingUpstairs", "sub": "GoneHeadless", "cycles": 5, "contribs": 118, "img": "post31"},
{"upvotes":6237, "title": "[NSFW] metasequioa glyptostroboides sheds to provide some nice plot in Redwood [xpost from r/trees] ", "username": "FernFan69", "sub": "watchitfortheleaves", "cycles": 5, "contribs": 640, "img": "post32"},
{"upvotes":2682, "title": "HoloFlix unleashes three billion new episodes of real time botanical drama series Redwood!", "username": "TyloWasAClone", "sub": "trees", "cycles": 5, "contribs": 66, "img": "post33"},
{"upvotes":67, "title": "If ZxsJsxi loves us and can see us from inside tiny quantum particles, why doesnÕt it ever say anything?  ", "username": "ReplicantRavager", "sub": "DebateAQuantumTruther", "cycles": 5, "contribs": 145, "img": "post34"},
{"upvotes":223, "title": "Is it wrong to devour a species capable of a psychic projection plea for mercy? ", "username": "ConfusedXenopod", "sub": "AskXenonians", "cycles": 4, "contribs": 123, "img": "post35"},
{"upvotes":2389, "title": "So my friend can finally get a new perspective on life.", "username": "CraterKitten", "sub": "LeWrongRegeneration", "cycles": 7, "contribs": 641, "img": "post36"},
{"upvotes":8120, "title": "Check out my vintage ride!", "username": "DragonRider", "sub": "MuskMobiles", "cycles": 15, "contribs": 521, "img": "post37"},
{"upvotes":829, "title": "Andyserkis algorithm v9.31 wins Best Actor for Hoffman ", "username": "ForceUser", "sub": "Projections", "cycles": 5, "contribs": 0, "img": "post38"},
{"upvotes":0, "title": "39481T", "username": "Dat_Wormhole", "sub": "CellularNSFW", "cycles": 5, "contribs": 0, "img": "post39"},
{"upvotes":7629, "title": "Whistleblower reveals GSA is secretly cloning all of us! We must demand cellular privacy for everyone! ", "username": "Max_Rebo", "sub": "CellularRights", "cycles": 5, "contribs": 5902, "img": "post40"},
{"upvotes":52, "title": "Remote outpost discovers ancient astronaut floating in deep space.  ", "username": "253Mathilde", "sub": "AsteroidMiners", "cycles": 2, "contribs": 12, "img": "post41"},
{"upvotes":92, "title": "So long sun! Earthlings say farewell as their star is consumed by orbital Bitcoin mining rig. ", "username": "tannhausergatecrasher", "sub": "Nostalgia", "cycles": 23, "contribs": 330, "img": "post42"},
{"upvotes":141, "title": "Centurians trapped inside Friend Zone on the moon of Fedora", "username": "EntropyThief", "sub": "NiceAliens", "cycles": 12, "contribs": 93, "img": "post43"},
{"upvotes":681, "title": "Galactic Security Administration deny implanting fake memories of treason in all sentient lifeforms ", "username": "moonraker", "sub": "politics", "cycles": 1, "contribs": 823, "img": "post44"},
{"upvotes":0, "title": "9483M", "username": "", "sub": "", "cycles": 0, "contribs": 0, "img": "post45"},
{"upvotes":0, "title": "9483M", "username": "YouLookDelicious", "sub": "AMA", "cycles": 5, "contribs": 0, "img": "post46"},
{"upvotes":309, "title": "Valvetopians still praying for the arrival of mythological entity", "username": "23fsdf", "sub": "atheism", "cycles": 2, "contribs": 640, "img": "post47"},
{"upvotes":1210, "title": "Only 3012 breedlings will recall this!", "username": "AuronLove4eva", "sub": "Milleniumals", "cycles": 3, "contribs": 102, "img": "post48"},
{"upvotes":284, "title": "ViacomcastFoxsneyCorp absorbs remainder of the Pegasus Galaxy.", "username": "Starfucker", "sub": "news", "cycles": 2, "contribs": 2479, "img": "post49"},
{"upvotes":1031, "title": "[BREAKING] Etherium energy vaults of XP1 robbed by conscious flesh eating bacteria that can seduce victims through charm", "username": "H1379g", "sub": "BacteriaToTheFuture", "cycles": 5, "contribs": 41, "img": "post50"},
{"upvotes":9420, "title": "Check out my newest creation, FireMites!", "username": "OnlyRacistAgainstXenonians", "sub": "3Dspeciesprinting", "cycles": 5, "contribs": 643, "img": "post51"}
];
