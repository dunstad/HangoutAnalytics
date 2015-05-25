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
	codeField.style.border = "solid 1px black";
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
	submit.textContent = "Submit";
	submit.id = "submit";

	textArea.textContent = "";
	textArea.appendChild(titleField);
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(codeField);
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(document.createElement("br"));
	textArea.appendChild(submit);

	var myCodeMirror = CodeMirror.fromTextArea(codeField,
		{"lineNumbers": true, "mode":"javascript", "theme": "mbo"});

};

QUERIES["Word Count"] = function() {

	var searchForm = document.createElement('input');
	searchForm.type = "content";
	searchForm.style.border = "solid 1px";
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
	  for (var name in PROFILES) {

		people[name] = 0;

	  }

	  console.log(people);

	  for (var i = 0; i < searchMessages.length; i++) {

		people[searchMessages[i].sender]++;

	  }

	  var spanContainer = document.createElement("span");
	  spanContainer.id = "results";
	  for (var name in people) {

			spanContainer.appendChild(document.createTextNode(name + ": " + people[name]));

	  }

	  document.getElementById("content").appendChild(spanContainer);

	  searchForm.value = "";

	};
	submit.textContent = "Submit";
	submit.id = "submit";


	removeChildren(document.getElementById("content"));
	document.getElementById("content").appendChild(searchForm);
	document.getElementById("content").appendChild(submit);
	document.getElementById("content").appendChild(document.createElement("br"));

};

QUERIES["Random Message"] = function() {

	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	removeChildren(document.getElementById("content"));
	document.getElementById("content").appendChild(toString(randomMessage));

};

// a slightly less terrible implementation than the previous one
QUERIES["Whose Line Is It Anyway?"] = function() {

	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	/* will run forever if nobody has ever sent a message longer than 4 characters
	   in which case why are you even using this program */
	while (randomMessage.text.length < 4) {randomMessage = MESSAGES[randInt(0, MESSAGES.length)];}

	// leave out the date
	var message = createStyledMessage(randomMessage.sender, randomMessage.text);
	message.firstChild.id = "hidden";
	message.firstChild.style.visibility = "hidden";

	var button = createStyledMessage(undefined, "Reveal Answer");
	button.className += " clickable";
	button.onclick = showHidden;

	var textElement = document.getElementById("content");
	removeChildren(textElement);
	textElement.appendChild(message);
	textElement.appendChild(button);

};

function showHidden() {

	document.getElementById("hidden").style.visibility = "visible";

}

// not really very useful
QUERIES["Longest 100 Messages"] = function() {

	MESSAGES.sort(function(a, b) {return (b.text.length - a.text.length);});

	removeChildren(document.getElementById("content"));
	for (var i = 0; i < 100; i++) {

		document.getElementById("content").appendChild(toString(MESSAGES[i]));

	}

};

QUERIES["Number of Messages"] = function() {

	var names = {};

	for (var i = 0; i < MESSAGES.length; i++) {

		var sender = MESSAGES[i].sender;
		if (!names[sender]) {names[sender] = 1;}
		else {names[sender]++;}

	}

	removeChildren(document.getElementById("content"));
	for (var name in names) {

		var result = createStyledMessage(name, names[name] + " messages, " + (Math.round(names[name] / MESSAGES.length * 10000) / 100) + "% of total");
		// var result = document.createTextNode(name + ": " + names[name] + ", " + (Math.round(names[name] / MESSAGES.length * 10000) / 100) + "%");

		document.getElementById("content").appendChild(result);

	}

};

QUERIES["Average Message Length"] = function() {

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

	removeChildren(document.getElementById("content"));
	for (var name in names) {

		var result = createStyledMessage(name, Math.round((names[name]["length"] / names[name]["number"])) + " characters");

		document.getElementById("content").appendChild(result);

	}

};

// list out names of chat participants and add an event handler
QUERIES["Comments By User"] = function() {

	if (PROFILES[MESSAGES[0].sender] === undefined) {buildProfiles();}

	removeChildren(document.getElementById("content"));
	for (var name in PROFILES) {

		var nameButton = createStyledMessage(name);
		nameButton.className += " clickable";

		nameButton.onclick = showCommentsMaker(name);

		document.getElementById("content").appendChild(nameButton);

	}

};

// weirdest pattern ever
function showCommentsMaker(name) {

	return function(){showComments(name);};

}

// the event handler mentioned above, adds the person's comments to content
function showComments(name) {

	var userComments = document.createElement("div");
	for (var i = 0; i < PROFILES[name].length; i++) {

		userComments.appendChild(toString(PROFILES[name][i]));

	}

	removeChildren(document.getElementById("content"));
	document.getElementById("content").appendChild(userComments);

}

// guess what this does?
function addQueryToSidebar(query) {

	var sidebar = document.getElementById("navigation");

	// create query link
	var queryButton = document.createElement("button");
	queryButton.className = "clickable";
	queryButton.textContent = query;
	queryButton.onclick = QUERIES[query];

	// because an img tag has to have a src
	var invisibleImage = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

	// create edit button
	var editButton = document.createElement("img");
	editButton.className = "editButton clickable";
	editButton.alt = "edit";
	editButton.src = invisibleImage;
	editButton.query = query;
	editButton.onclick = function () {

		var queryText;
		if (!localStorage[this.query]) {queryText = QUERIES[this.query].toString();}
		else {queryText = localStorage[this.query];}

		QUERIES["Make A New Query"](undefined, this.query, queryText);

	};

	// create delete button
	var deleteButton = document.createElement("img");
	deleteButton.className = "deleteButton clickable";
	deleteButton.alt = "delete";
	deleteButton.src = invisibleImage;
	deleteButton.query = query;
	deleteButton.onclick = function () {

		if (confirm("Are you sure you want to delete " + query + "?")) {

			delete QUERIES[this.query];
			delete localStorage[this.query];
			document.getElementById("navigation").removeChild(document.getElementById(this.query));

		}

	};

	var containerSpan = document.createElement("span");
	containerSpan.id = query;
	containerSpan.className = "flexHorizontal";

	containerSpan.appendChild(queryButton);
	containerSpan.appendChild(editButton);
	containerSpan.appendChild(deleteButton);

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
