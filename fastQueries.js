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

	// reducing the size of the penises the editor sucks
	var myCodeMirror = CodeMirror.fromTextArea(codeField, {"lineNumbers": true});

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

QUERIES["showRandomMessage"] = function() {

	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	removeChildren(document.getElementById("content"));
	document.getElementById("content").appendChild(toString(randomMessage));

};

// a slightly less cancerous implementation than the previous one
QUERIES["whoseLineIsItAnyway"] = function() {

	var randomMessage = MESSAGES[randInt(0, MESSAGES.length)];
	/* will run forever if nobody has ever sent a message longer than 4 characters
	   in which case why are you even using this program */
	while (randomMessage.text.length < 4) {randomMessage = MESSAGES[randInt(0, MESSAGES.length)];}

	var button = document.createElement('button');
	button.type = "button";
	button.onclick = showHidden;
	button.textContent = "Reveal Answer";

	var hiddenText = document.createElement('span');
	hiddenText.id = "hidden";
	hiddenText.style.display = "none";
	hiddenText.textContent = randomMessage.sender + ": ";

	var messageText = document.createTextNode(randomMessage.text);

	var textElement = document.getElementById("content");
	textElement.textContent = "";
	textElement.appendChild(hiddenText);
	textElement.appendChild(messageText);
	textElement.appendChild(document.createElement('br'));
	textElement.appendChild(button);
	textElement.appendChild(document.createElement('br'));
	textElement.appendChild(document.createElement('br'));

};

function showHidden() {

	document.getElementById("hidden").style.display = "inline";

}

// not really very useful
QUERIES["longest100"] = function() {

	MESSAGES.sort(function(a, b) {return (b.text.length - a.text.length);});

	removeChildren(document.getElementById("content"));
	for (var i = 0; i < 100; i++) {

		document.getElementById("content").appendChild(toString(MESSAGES[i]));

	}

};

QUERIES["whoTalksMost"] = function() {

	var names = {};

	for (var i = 0; i < MESSAGES.length; i++) {

		var sender = MESSAGES[i].sender;
		if (!names[sender]) {names[sender] = 1;}
		else {names[sender]++;}

	}

	removeChildren(document.getElementById("content"));
	for (var name in names) {

		var result = document.createTextNode(name + ": " + names[name] + ", " + (Math.round(names[name] / MESSAGES.length * 10000) / 100) + "%");

		document.getElementById("content").appendChild(result);

	}

};

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

	removeChildren(document.getElementById("content"));
	for (var name in names) {

		var result = document.createTextNode(name + ": " + (names[name]["length"] / names[name]["number"]));
		document.getElementById("content").appendChild(result);

	}

};

// this is pretty ugly
QUERIES["commentsByUser"] = function() {

	if (PROFILES[MESSAGES[0].sender] === undefined) {buildProfiles();}

	removeChildren(document.getElementById("content"));
	for (var name in PROFILES) {

		// "<a href=\"javascript:showComments('" + name + "');\">" + name + "</a>";
		var result = document.createElement("a");
		result.href = "javascript:showComments('" + name + "');"
		result.textContent = name;

		document.getElementById("content").appendChild(result);

	}

};

// but hey it works... kinda
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

		QUERIES["Make A New Query"](undefined, this.query, localStorage[this.query]);

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
