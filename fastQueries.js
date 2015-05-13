// i'm pretty sure inline comments break the queries,
// so don't put those inside queries. use /* */ instead.

// this is where the queries are stored.
QUERIES = {};

// here are the default queries
QUERIES["Make A New Query"] = function(e, title, code) {
	
	var textArea = document.getElementById("content");
	
	var titleField = document.createElement("input");
	titleField.type = "content";
	titleField.style.border = "solid 1px";
	titleField.id = "titleField";
	if (title) {titleField.value = title;}
	
	var codeField = document.createElement("textarea");
	codeField.rows = 50;
	codeField.cols = 80;
	codeField.style.border = "solid 1px";
	codeField.id = "codeField";
	if (code) {codeField.value = code;}
	
	var submit = document.createElement("button");
	submit.type = "button";
	submit.onclick = function() {
			
		if (document.getElementById(titleField.value)) {alert("There's already a query by this name.");}
		else if (titleField.value === "") {alert("Give your query a name!");}
		
		else {
			
			var functionString = "(function() {" + myCodeMirror.getValue() + "})";
			QUERIES[titleField.value] = eval(functionString);
			
			localStorage[titleField.value] = myCodeMirror.getValue();
			
			addQueryToSidebar(titleField.value);
			
			titleField.value = "";
			myCodeMirror.getDoc().setValue("");
			
		}
		
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
	
	// reducing the size of the penises the editor sucks
	var myCodeMirror = CodeMirror.fromTextArea(codeField, {"lineNumbers": true});
	
}

QUERIES["Word Count"] = function() {
	
	var searchForm = document.createElement('input');
	searchForm.type = "content";
	searchForm.style.border = "solid 1px"
	searchForm.id = "searchForm";

	var submit = document.createElement("button");
	submit.type = "button";
	submit.onclick = function() {

	  /* delete old results, if present */
	  if (document.getElementById("results")) {
		
		document.getElementById("content").removeChild(document.getElementById("results"));
		
	  }
	  
	  var searchMessages = [];

	  for (var i = 0; i < MESSAGES.length; i++) {

		if (MESSAGES[i].text.toLowerCase().indexOf(searchForm.value.toLowerCase()) !== -1) {

		  searchMessages.push(MESSAGES[i]);

		}

	  }
      
	  console.log(searchMessages);
	  
	  var people = {};
	  for (name in PROFILES) {

		people[name] = 0;

	  }
	  
	  console.log(people);

	  for (var i = 0; i < searchMessages.length; i++) {
		
		people[searchMessages[i].sender]++;

	  }

	  var messageHTML = "";
	  for (var name in people) {

		messageHTML += name + ": " + people[name] + "<br><br>";

	  }
	  
	  var spanContainer = document.createElement("span");
	  spanContainer.innerHTML = messageHTML;
	  spanContainer.id = "results";

	  document.getElementById("content").appendChild(spanContainer);
	  
	  searchForm.value = "";

	};
	submit.innerHTML = "Submit";
	submit.id = "submit";


	document.getElementById("content").innerHTML = "";
	document.getElementById("content").appendChild(searchForm);
	document.getElementById("content").appendChild(submit);
	document.getElementById("content").appendChild(document.createElement("br"));

}

QUERIES["showRandomMessage"] = function() {
	
	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	document.getElementById("content").innerHTML = "";
	document.getElementById("content").innerHTML = toString(randomMessage) + "<br/><br/>";
	
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
	
	var textElement = document.getElementById("content");
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
	
	document.getElementById("content").innerHTML = "";
	for (var i = 0; i < 100; i++) {
		
		document.getElementById("content").innerHTML += toString(MESSAGES[i]) + "<br/><br/>";
		
	}
	
}

QUERIES["whoTalksMost"] = function() {
	
	var names = {};
	
	for (var i = 0; i < MESSAGES.length; i++) {
		
		var sender = MESSAGES[i].sender;
		if (!names[sender]) {names[sender] = 1;}
		else {names[sender]++;}
		
	}
	
	document.getElementById("content").innerHTML = "";
	for (name in names) {
		
		document.getElementById("content").innerHTML += name + ": " + names[name] + ", " + (Math.round(names[name] / MESSAGES.length * 10000) / 100) + "%" + "<br/><br/>";
		
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
	
	document.getElementById("content").innerHTML = "";
	for (name in names) {
		
		document.getElementById("content").innerHTML += name + ": " + (names[name]["length"] / names[name]["number"]) + "<br/><br/>";
		
	}
	
}

// this is pretty ugly
QUERIES["commentsByUser"] = function() {
	
	if (PROFILES[MESSAGES[0].sender] === undefined) {buildProfiles();}
	
	document.getElementById("content").innerHTML = "";
	for (name in PROFILES) {
		
		document.getElementById("content").innerHTML += "<a href=\"javascript:showComments('" + name + "');\">" + name + "</a><br/><br/>"
		
	}
	
}

// but hey it works... kinda
function showComments(name) {
	
	var userComments = "";
	for (var i = 0; i < PROFILES[name].length; i++) {
		
		userComments += toString(PROFILES[name][i]) + "<br/><br/>"
		
	}
	
	document.getElementById("content").innerHTML = "";
	document.getElementById("content").innerHTML = userComments;
	
}

// guess what this does?
function addQueryToSidebar(query) {
	
	var sidebar = document.getElementById("navigation");
	
	// create query link
	var link = document.createElement("a");
	link.text = query;
	link.href = "javascript:;";
	link.onclick = QUERIES[query];
	
	// create edit button
	var editButton = document.createElement("img");
	editButton.src = "edit.png";
	editButton.alt = "edit";
	editButton.width = 15;
	editButton.height = 15;
	editButton.style.display = "inline";
	editButton.style.padding = "0px 0px 0px 10px";
	editButton.query = query;
	editButton.onclick = function () {
	
		QUERIES["Make A New Query"](undefined, this.query, localStorage[this.query]);
		
	}
	
	// create delete button
	var deleteButton = document.createElement("img");
	deleteButton.src = "delete.png";
	deleteButton.alt = "delete";
	deleteButton.width = 15;
	deleteButton.height = 15;
	deleteButton.style.display = "inline";
	deleteButton.style.padding = "0px 0px 0px 10px";
	deleteButton.query = query;
	deleteButton.onclick = function () {
		
		if (confirm("Are you sure you want to delete " + query + "?")) {
			
			delete QUERIES[this.query];
			delete localStorage[this.query];
			document.getElementById("navigation").removeChild(document.getElementById(this.query));
			
		}
		
	}
	
	var containerSpan = document.createElement("span");
	containerSpan.id = query;
	
	containerSpan.appendChild(link);
	containerSpan.appendChild(editButton);
	containerSpan.appendChild(deleteButton);
	containerSpan.appendChild(document.createElement("br"));
	containerSpan.appendChild(document.createElement("br"));
	
	sidebar.appendChild(containerSpan);
	
}

// pull saved queries from localStorage
for (var query in localStorage) {
	
	QUERIES[query] = eval("(function(e) {" + localStorage[query] + "})");
	
}

// create links for all of the queries
for (var query in QUERIES) {
	
	addQueryToSidebar(query);
	
}