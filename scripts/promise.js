(function(env, factory){
	if (env.jpm && typeof env.jpm.define === 'function') {
		
	} else if (env.module && typeof module.exports !== 'undefined') {
		factory(module.exports);
	} else {
		env.promise = factory({}); 
	}
}(this, function(exports){
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
	
}));