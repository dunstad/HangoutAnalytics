function setCookie(cookie_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = cookie_name + "=" + escape(value) +
	((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
}

function getCookie(cookie_name) {
	if (document.cookie.length > 0) {
	  cookie_start = document.cookie.indexOf(cookie_name + "=");
		if (cookie_start != -1) {
			cookie_start = cookie_start + cookie_name.length + 1;
			cookie_end = document.cookie.indexOf(";", cookie_start);
			if (cookie_end == -1) cookie_end = document.cookie.length;
			return unescape(document.cookie.substring(cookie_start,cookie_end));
		}
	}
	return "";
}