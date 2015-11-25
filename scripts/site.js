(function(){
	var createXHR = function(){
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest;	
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		return null;	
	};
}());