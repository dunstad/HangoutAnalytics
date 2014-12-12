// reading the source code? what a nerd

var CONVERSATION = DATA.conversation_state[1];
var MESSAGELIST = CONVERSATION.conversation_state.event;
var PARTICIPANTS = createParticipantMap(CONVERSATION);

// correlate the IDs with the names
function createParticipantMap(conversation) {
	
	var participants = {};
	var participantList = conversation.conversation_state.conversation.participant_data
	
	for (var i = 0; i < participantList.length; i++) {
		
		participants[participantList[i].id.chat_id] = participantList[i].fallback_name;
		
	}
	
	return participants;
	
}

// pull message data out of the huge json swamp
function getMessage(index) {
	
	var message = MESSAGELIST[index];
	return message;
	
}

// metawrapper
function getMessageData(index) {
	
	return createEasyMessage(getMessage(index));
	
}

// basically wrapping up the weird property structure into a simple one
function createEasyMessage(message) {
	
	var easyMessage = {};
	
	// edge case
	if (message.event_type == "RENAME_CONVERSATION") {
			
		easyMessage.text = "Conversation Renamed";
		
	}
	
	// another edge case
	else if (message.event_type == "ADD_USER") {
			
		easyMessage.text = "User Added";
		
	}
	
	// more edge cases
	else if (message.hangout_event && message.hangout_event.event_type == "START_HANGOUT") {
		
		easyMessage.text = "Hangout Started";
		
	}
	
	// omg so many of these
	else if (message.hangout_event && message.hangout_event.event_type == "END_HANGOUT") {
		
		easyMessage.text = "Hangout Ended";
		
	}
	
	// fuck stop it already
	else if (message.chat_message && message.chat_message.message_content.attachment) {
		
		easyMessage.text = "Attachment";
		
	}
	
	// jesus finally
	else {
		
		easyMessage.text = connectSegment(message.chat_message.message_content.segment);
		
	}
	
	easyMessage.sender = PARTICIPANTS[message.sender_id.chat_id];
	easyMessage.time = parseInt(message.timestamp.substring(0, message.timestamp.length - 3));
	easyMessage.toString = function() {
		
		return this.sender + ": " + this.text + "<br/>" + new Date(this.time);
		
	};
	
	return easyMessage
}

// put the text in the segment array back together
// why is it separated in the first place?!
// these breaks happen in the middle of sentences even
function connectSegment(segment) {
	
	var text = "";
	
	for (var i = 0; i < segment.length; i++) {
		
		text += segment[i].text;
		
	}
	
	return text;
	
}

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

// but hey it works
function showComments(name) {
	
	document.getElementById("text").innerHTML = "";
	for (var i = 0; i < PROFILES[name].length; i++) {
		
		document.getElementById("text").innerHTML += PROFILES[name][i].toString() + "<br/><br/>"
		
	}
	
}