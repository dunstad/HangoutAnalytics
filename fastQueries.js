// not sure this code needs to wait until a file is selected to be run
// also i'm pretty sure inline comments break the queries,
// so don't put those inside queries. use /* */ instead.

// inclusive, exclusive
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function toString(message) {		
	
	return message.sender + ": " + message.text + "<br/>" + new Date(message.time);
	
}

// this is where the queries are stored.
QUERIES = {};

// pull saved queries from localStorage
for (var query in localStorage) {
	
	QUERIES[query] = eval("(function() {" + localStorage[query] + "})");
	
}

// here are the default queries

QUERIES["Make A New Query"] = function() {
	
	var textArea = document.getElementById("text");
	
	var titleField = document.createElement("input");
	titleField.type = "text";
	titleField.style.border = "solid 1px";
	titleField.id = "titleField";
	
	var codeField = document.createElement("textarea");
	codeField.rows = 50;
	codeField.cols = 80;
	codeField.style.border = "solid 1px";
	codeField.id = "codeField";
	
	var submit = document.createElement("button");
	submit.type = "button";
	submit.onclick = function() {
		
		var functionString = "(function() {" + codeField.value + "})";
		QUERIES[titleField.value] = eval(functionString);
		
		localStorage[titleField.value] = codeField.value;
		
		addQueryToSidebar(titleField.value);
		
		titleField.value = "";
		codeField.value = "";
		
	};
	submit.innerHTML = "Submit";
	submit.id = "submit";
	
	textArea.innerHTML = "";
	textArea.appendChild(titleField);
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(codeField);
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(submit);
	
}

QUERIES["showRandomMessage"] = function() {
	
	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	document.getElementById("text").innerHTML = "";
	document.getElementById("text").innerHTML = toString(randomMessage) + "<br/><br/>";
	
}

// a slightly less cancerous implementation than the previous one
QUERIES["whoseLineIsItAnyway"] = function() {
	
	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	/* will run forever if nobody has ever sent a message longer than 4 characters
	   in which case why are you even using this program */
	while (randomMessage.text.length < 4) {randomMessage = MESSAGES[randInt(0, MESSAGES.length)];}
	
	var button = document.createElement('button');
	button.type = "button";
	button.onclick = showHidden;
	button.innerHTML = "Reveal Answer";
	
	var hiddenText = document.createElement('span');
	hiddenText.id = "hidden";
	hiddenText.style.display = "none";
	hiddenText.innerHTML = randomMessage.sender + ": ";
	
	var messageText = document.createTextNode(randomMessage.text);
	
	var textElement = document.getElementById("text");
	textElement.innerHTML = "";
	textElement.appendChild(hiddenText);
	textElement.appendChild(messageText);
	textElement.appendChild(document.createElement('br'));
	textElement.appendChild(button);
	textElement.appendChild(document.createElement('br'));
	textElement.appendChild(document.createElement('br'));
	
}

function showHidden() {
	
	document.getElementById("hidden").style.display = "inline";
	
}

// not really very useful
QUERIES["longest100"] = function() {
	
	MESSAGES.sort(function(a, b) {return (b.text.length - a.text.length);});
	
	document.getElementById("text").innerHTML = "";
	for (var i = 0; i < 100; i++) {
		
		document.getElementById("text").innerHTML += toString(MESSAGES[i]) + "<br/><br/>";
		
	}
	
}

QUERIES["whoTalksMost"] = function() {
	
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

QUERIES["averageMessageLength"] = function() {
	
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
buildProfiles(); // initialized here so that this is available to the queries whether or not commentsByUser gets clicked

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
QUERIES["commentsByUser"] = function() {
	
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

// guess what this does?
function addQueryToSidebar(query) {
	
	var sidebar = document.getElementById("sidebar");
	var link = document.createElement("a");
	link.text = query;
	link.href = "javascript:;";
	link.onclick = QUERIES[query];
	sidebar.appendChild(link);
	sidebar.appendChild(document.createElement('br'));
	sidebar.appendChild(document.createElement('br'));
	
}

// create links for all of the queries
for (var query in QUERIES) {
	
	addQueryToSidebar(query);
	
}