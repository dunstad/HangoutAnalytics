// begin throwing away google's secrets if that hasn't been done already
window.onload = function() {

	// i'm definitely going to forget to toggle this
	debug = true;

	if (localStorage.MESSAGES === undefined) { // this is always true, localStorage is too small

		// hide the guide link for visual effect
		document.getElementById("guide").style.visibility = "hidden";

		var fileForm = document.getElementById("file");
		fileForm.onchange = function() {

			var file = fileForm.files[0];
			var reader = new FileReader();
			reader.onloadend = loadJavascript;
			reader.readAsText(file);

		};

		// for when you get here with the back button and your file's still selected
		if (fileForm.value !== "") {fileForm.onchange();}

	}

};

function createScriptElement(name) {

	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', name);
	return script;

}

function loadJavascript(e) {

	DATA = JSON.parse(e.target.result);

	document.head.appendChild(createScriptElement("readJSON.js")).onload =
		function() {document.head.appendChild(createScriptElement("fastQueries.js"));
	};

	document.getElementById("guide").style.visibility = "visible"; // ta da!

}
