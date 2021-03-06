// reading the source code? what a nerd

var CONVERSATIONS = DATA.conversation_state;

var MESSAGELIST = [];
for (var i = 0; i < CONVERSATIONS.length; i++) {

	MESSAGELIST = MESSAGELIST.concat(CONVERSATIONS[i].conversation_state.event);

}


var PARTICIPANTS = createParticipantMap(CONVERSATIONS);

// throw away all of google's information about our diets and sex lives
// cuts the size of the json file by like 7x
var MESSAGES = [];

// add sorting by timestamp
MESSAGES.sort(function(a, b){return a.time - b.time;});

for (var i = 0; i < MESSAGELIST.length; i++) {

	MESSAGES.push(getMessageData(i));

}

// the messages are seriously distracting while trying to code
if (debug) {

	var filler = ["Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipisicing", "elit,", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua.", "Ut", "enim", "ad", "minim", "veniam,", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat.", "Duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur.", "Excepteur", "sint", "occaecat", "cupidatat", "non", "proident,", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"];
	for (var i = 0; i < MESSAGES.length; i++) {

		var fillerLen = MESSAGES[i].text.split(" ").length;
		MESSAGES[i].text = "";
		for (var j  = 0; j < fillerLen; j++) {

			MESSAGES[i].text += filler[j % filler.length] + " ";

		}

	}

}

// create PROFILES, for convenience
// global because otherwise showComments won't
// be able to see it by the time it gets called
var PROFILES = {};

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

// initialized here so that this is available to the queries
// whether or not commentsByUser gets clicked
buildProfiles();

// inclusive, exclusive
function randInt(min, max) {

	return Math.floor(Math.random() * (max - min)) + min;

}

// make fancy looking divs for messages and other text
function createStyledMessage(name, text, time) {

	var messageContainer = document.createElement("div");
	messageContainer.className = "message";

	var nameContainer = document.createElement("div");
	nameContainer.className = "sender";
	nameContainer.textContent = name;

	var textContainer = document.createElement("div");
	textContainer.className = "content";
	textContainer.textContent = text;

	var timeContainer = document.createElement("div");
	timeContainer.className = "time";
	timeContainer.textContent = new Date(time);

	if (name) {messageContainer.appendChild(nameContainer);}
	if (text) {messageContainer.appendChild(textContainer);}
	if (time) {messageContainer.appendChild(timeContainer);}

	return messageContainer;

}

// turns a message into DOM nodes
function toString(message) {

	return createStyledMessage(message.sender, message.text, message.time);

}

function removeChildren(node) {

	while(node.firstChild) {

		node.removeChild(node.firstChild);

	}

}

// correlate the IDs with the names
function createParticipantMap(conversations) {

	var participants = {};

	for (var i = 0; i < conversations.length; i++) {

		var participantList = conversations[i].conversation_state.conversation.participant_data;

		for (var j = 0; j < participantList.length; j++) {

			participants[participantList[j].id.chat_id] = participantList[j].fallback_name;

		}

	}

	return participants;

}

// pull message data out of the huge json swamp
function getMessageData(index) {

	return createEasyMessage(MESSAGELIST[index]);

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

	// and another one
	else if (message.event_type == "REMOVE_USER") {

		easyMessage.text = "User Removed";

	}

	// more edge cases
	else if (message.hangout_event && message.hangout_event.event_type == "START_HANGOUT") {

		easyMessage.text = "Hangout Started";

	}

	// omg so many of these
	else if (message.hangout_event && message.hangout_event.event_type == "END_HANGOUT") {

		easyMessage.text = "Hangout Ended";

	}

	// please stop already
	else if (message.chat_message && message.chat_message.message_content.attachment) {

		easyMessage.text = "Attachment";

	}

	// jesus finally
	else {

		easyMessage.text = connectSegment(message.chat_message.message_content.segment);

	}

	easyMessage.sender = PARTICIPANTS[message.sender_id.chat_id];
	// google's timestamp format doesn't play nice with Date's constructor
	easyMessage.time = parseInt(message.timestamp.substring(0, message.timestamp.length - 3));

	return easyMessage;
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
