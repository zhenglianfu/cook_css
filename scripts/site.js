(function(){
	var createXHR = function(){
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest;	
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		return null;	
	};
	// 实现promise， 不能在外部访问状态机
	function Promise(){
		this.listeners = [];
		this.length = 0;	
	};
	Promise.prototype = {
		done: function(){},
		promise: function(){}	
	};
	// defer 
	function defer(){
		
	}
}());