function createScriptElement(name) {
		
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', name);
	return script;
	
}

var jsonLocation = getCookie("jsonLocation");

// need this line while we're local only
// just store the json in the same folder as this
if (jsonLocation === "") {jsonLocation = "Hangouts.js";}
// if (jsonLocation === "") {jsonLocation = "Messages.js";}

// this will work when it's up on a real website,
// but cookies don't work on file:/// webpages by default.
// the use case is if you don't have the site locally,
// then you can just supply the data.
if (jsonLocation === "") {
	
	// file:///C:/Users/Dunstad/Dropbox/Web/HangoutStats/Hangouts.js
	jsonLocation = prompt("Where is your Hangouts data? (Ex. file:///C:/Hangouts.js)");
	setCookie("jsonLocation", jsonLocation, 9999);
	
}

var json = createScriptElement(jsonLocation);
json.setAttribute("onload", "loadJavascript()");
document.head.appendChild(json);

function loadJavascript() {
	
	document.head.appendChild(createScriptElement("readJSON.js"));
	document.head.appendChild(createScriptElement("queries.js"));
	// document.head.appendChild(createScriptElement("fastQueries.js"));
	
}