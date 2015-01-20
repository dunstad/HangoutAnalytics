// these work off of Messages.js instead of Hangouts.js
// Messages.js basically throws away a lot of the useless data from the original json

// we rebuilt them... better, faster, stronger

// inclusive, exclusive
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function toString(message) {		
	
	return message.sender + ": " + message.text + "<br/>" + new Date(message.time);
	
}

function showRandomMessage() {
	
	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	document.getElementById("text").innerHTML = "";
	document.getElementById("text").innerHTML = toString(randomMessage) + "<br/><br/>";
	
}

// writing html in javascript gives me cancer
function whoseLineIsItAnyway() {
	
	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	// will run forever if nobody has ever sent a message longer than 4 characters
	// in which case why are you even using this program
	while (randomMessage.text.length < 4) {randomMessage = MESSAGES[randInt(0, MESSAGES.length)];}
	var button = "<br/><button type=\"button\" onclick=\"showHidden()\">Reveal Answer</button>";
	document.getElementById("text").innerHTML = "";
	document.getElementById("text").innerHTML += "<span id=\"hidden\" style=\"display:none;\">" + randomMessage.sender + ": </span>" + randomMessage.text + button +  "<br/><br/>";
	
}

function showHidden() {
	
	document.getElementById("hidden").style.display = "inline";
	
}

// not really very useful
function longest100() {
	
	MESSAGES.sort(function(a, b) {return (b.text.length - a.text.length);});
	
	document.getElementById("text").innerHTML = "";
	for (var i = 0; i < 100; i++) {
		
		document.getElementById("text").innerHTML += toString(MESSAGES[i]) + "<br/><br/>";
		
	}
	
}

function whoTalksMost() {
	
	var names = {};
	
	for (var i = 0; i < MESSAGES.length; i++) {
		
		var sender = MESSAGES[i].sender;
		if (!names[sender]) {names[sender] = 1;}
		else {names[sender]++;}
		
	}
	
	document.getElementById("text").innerHTML = "";
	for (name in names) {
		
		document.getElementById("text").innerHTML += name + ": " + names[name] + ", " + (Math.round(names[name] / MESSAGES.length * 10000) / 100) + "%" + "<br/><br/>";
		
	}
	
}

function averageMessageLength() {
	
	var names = {};
	
	for (var i = 0; i < MESSAGES.length; i++) {
		
		var sender = MESSAGES[i].sender;
		if (!names[sender]) {
			
			names[sender] = {};
			names[sender]["length"] = MESSAGES[i].text.length;
			names[sender]["number"] = 1;
			
		}
		else {
			
			names[sender]["length"] += MESSAGES[i].text.length;
			names[sender]["number"] += 1;
			
		}
		
	}
	
	document.getElementById("text").innerHTML = "";
	for (name in names) {
		
		document.getElementById("text").innerHTML += name + ": " + (names[name]["length"] / names[name]["number"]) + "<br/><br/>";
		
	}
	
}

var PROFILES = {}; // global because otherwise showComments won't be able to see it by the time it gets called

function buildProfiles() {
		
	// set up storage for comments by user
	for (var i = 0; i < MESSAGES.length; i++) {
		
		if (PROFILES[MESSAGES[i].sender] === undefined) {
			
			PROFILES[MESSAGES[i].sender] = [];
			
		}
		
	}
	
	for (var i = 0; i < MESSAGES.length; i++) {
		
		var msg = MESSAGES[i];
		PROFILES[msg.sender].push(msg);
		
	}
	
}

// this is pretty ugly
function commentsByUser() {
	
	if (PROFILES[MESSAGES[0].sender] === undefined) {buildProfiles();}
	
	document.getElementById("text").innerHTML = "";
	for (name in PROFILES) {
		
		document.getElementById("text").innerHTML += "<a href=\"javascript:showComments('" + name + "');\">" + name + "</a><br/><br/>"
		
	}
	
}

// but hey it works... kinda
function showComments(name) {
	
	var userComments = "";
	for (var i = 0; i < PROFILES[name].length; i++) {
		
		userComments += toString(PROFILES[name][i]) + "<br/><br/>"
		
	}
	
	document.getElementById("text").innerHTML = "";
	document.getElementById("text").innerHTML = userComments;
	
}