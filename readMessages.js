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
	// google's timestamp format doesn't play nice with Date's constructor
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