// begin throwing away google's secrets if that hasn't been done already
window.onload = function() {
	
	if (localStorage.MESSAGES === undefined) {
		
		var fileForm = document.getElementById("file");
		fileForm.onchange = function() {
			
			var file = fileForm.files[0];
			var reader = new FileReader();
			reader.onload = loadJavascript;
			reader.readAsText(file);
			
			
		}
		
	}
	
	else {
		
		// just copied this from below. yes, i feel dirty.
		document.head.appendChild(createScriptElement("readJSON.js"));
		document.head.appendChild(createScriptElement("fastQueries.js"));
		
		// hope you didn't want to change which file you have loaded in
		var fileForm = document.getElementById("file")
		var sidebar = fileForm.parentNode;
		
		// i'm going to programmer hell
		sidebar.removeChild(sidebar.childNodes[0]);
		sidebar.removeChild(sidebar.childNodes[0]);
		sidebar.removeChild(sidebar.childNodes[0]);
		sidebar.removeChild(sidebar.childNodes[0]);
		
	}
	
}

function createScriptElement(name) {
		
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', name);
	return script;
	
}

function loadJavascript(e) {
	
	DATA = JSON.parse(e.target.result);
	document.head.appendChild(createScriptElement("readJSON.js"));
	document.head.appendChild(createScriptElement("fastQueries.js"));
	
}