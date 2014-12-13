// queries 'n' shit

// god i wish this was part of the main language
// i've written/copied this so many times
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function showRandomMessage() {
	
	var randomMessage = getMessageData(randInt(0, MESSAGELIST.length));
	document.getElementById("text").innerHTML = "";
	document.getElementById("text").innerHTML = randomMessage.toString() + "<br/><br/>";
	
}

// writing html in javascript gives me cancer
function whoseLineIsItAnyway() {
	
	var randomMessage = getMessageData(randInt(0, MESSAGELIST.length));
	// will run forever if nobody has ever sent a message longer than 4 characters
	// in which case why are you even using this code
	while (randomMessage.text.length < 4) {randomMessage = getMessageData(randInt(0, MESSAGELIST.length));}
	var button = "<br/><button type=\"button\" onclick=\"showHidden()\">Reveal Answer</button>";
	document.getElementById("text").innerHTML = "";
	document.getElementById("text").innerHTML += "<span id=\"hidden\" style=\"display:none;\">" + randomMessage.sender + ": </span>" + randomMessage.text + button +  "<br/><br/>";
	
}

function showHidden() {
	
	document.getElementById("hidden").style.display = "inline";
	
}

// not really very useful
function longest100() {
	
	MESSAGELIST.sort(function(a, b) {return (createEasyMessage(b).text.length - createEasyMessage(a).text.length);});
	
	document.getElementById("text").innerHTML = "";
	for (var i = 0; i < 100; i++) {
		
		document.getElementById("text").innerHTML += getMessageData(i).toString() + "<br/><br/>";
		
	}
	
}

function whoTalksMost() {
	
	var names = {};
	
	for (var i = 0; i < MESSAGELIST.length; i++) {
		
		var sender = getMessageData(i).sender;
		if (!names[sender]) {names[sender] = 1;}
		else {names[sender]++;}
		
	}
	
	document.getElementById("text").innerHTML = "";
	for (name in names) {
		
		document.getElementById("text").innerHTML += name + ": " + names[name] + ", " + (Math.round(names[name] / MESSAGELIST.length * 10000) / 100) + "%" + "<br/><br/>";
		
	}
	
}

function averageMessageLength() {
	
	var names = {};
	
	for (var i = 0; i < MESSAGELIST.length; i++) {
		
		var sender = getMessageData(i).sender;
		if (!names[sender]) {
			
			names[sender] = {};
			names[sender]["length"] = getMessageData(i).text.length;
			names[sender]["number"] = 1;
			
		}
		else {
			
			names[sender]["length"] += getMessageData(i).text.length;
			names[sender]["number"] += 1;
			
		}
		
	}
	
	document.getElementById("text").innerHTML = "";
	for (name in names) {
		
		document.getElementById("text").innerHTML += name + ": " + (names[name]["length"] / names[name]["number"]) + "<br/><br/>";
		
	}
	
}

// this is pretty ugly
function commentsByUser() {
	
	PROFILES = {};
	
	// set up storage for comments by user
	for (id in PARTICIPANTS) {
		
		PROFILES[PARTICIPANTS[id]] = [];
		
	}
	
	for (var i = 0; i < MESSAGELIST.length; i++) {
		
		var msg = getMessageData(i);
		PROFILES[msg.sender].push(msg);
		
	}
	
	document.getElementById("text").innerHTML = "";
	for (name in PROFILES) {
		
		document.getElementById("text").innerHTML += "<a href=\"javascript:showComments('" + name + "');\">" + name + "</a><br/><br/>"
		
	}
	
	
}

// but hey it works... kinda
function showComments(name) {
	
	document.getElementById("text").innerHTML = "";
	for (var i = 0; i < PROFILES[name].length; i++) {
		
		document.getElementById("text").innerHTML += PROFILES[name][i].toString() + "<br/><br/>"
		
	}
	
}