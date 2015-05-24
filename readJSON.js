// reading the source code? what a nerd

// use the data from the longest conversation
var conversationNumber = 0;
var conversationLength = 0;
for (var i = 0; i < DATA.conversation_state.length; i++) {

	if (DATA.conversation_state[i].conversation_state.event.length > conversationLength) {

		conversationLength = DATA.conversation_state[i].conversation_state.event.length;
		conversationNumber = i;

	}

}

var CONVERSATION = DATA.conversation_state[conversationNumber];
var MESSAGELIST = CONVERSATION.conversation_state.event;
var PARTICIPANTS = createParticipantMap(CONVERSATION);

// throw away all of google's information about our diets and sex lives
// cuts the size of the json file by like 7x
var MESSAGES = [];
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

// turns a message into DOM nodes
function toString(message) {

	var messageContainer = document.createElement("div");
	messageContainer.className = "message";

	var sender = document.createElement("div");
	sender.className = "sender";
	sender.textContent = message.sender;

	var content = document.createElement("div");
	content.className = "content";
	content.textContent = message.text;

	var date = document.createElement("div");
	date.className = "date";
	date.textContent = new Date(message.time);

	messageContainer.appendChild(sender);
	messageContainer.appendChild(content);
	messageContainer.appendChild(date);

	return messageContainer;

}

function removeChildren(node) {

	while(node.firstChild) {

		node.removeChild(node.firstChild);

	}

}

// correlate the IDs with the names
function createParticipantMap(conversation) {

	var participants = {};
	var participantList = conversation.conversation_state.conversation.participant_data;

	for (var i = 0; i < participantList.length; i++) {

		participants[participantList[i].id.chat_id] = participantList[i].fallback_name;

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
