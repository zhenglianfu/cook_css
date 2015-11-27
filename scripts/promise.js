(function(env, factory){
	if (env.jpm && typeof env.jpm.define === 'function') {
		
	} else if (env.module && typeof module.exports !== 'undefined') {
		factory(module.exports);
	} else {
		env.promise = factory({}); 
	}
}(this, function(exports){
	// 实现promise， 不能在外部访问状态机
	function Promise(ins){
		var origin = ins || {};
		// local and private variable of Promise
		var resolved = false;
		var callbacks = [];
		var length = 0;
		this.status = function(){
			return resolved;
		};
		this.reject = function(){
			resolved = false;
		}
		// resolve只能被调用一次，之后加入的handler会被立即执行。
		// [状态机只能变化一次，无法重置]
		this.resolve = function(){
			this.resolve = function(){};
			resolved = true;			
		};
		this.then = function(fn){
			typeof fn === 'function' ? (callbacks[length ++] = fn) : 0;
			return this;
		};
		return this;
	};
	Promise.prototype = {
		done: function(fn){
			this.status() ? (typeof fn === 'function' && fn()) : this.then(fn);
			return this;
		}
	};
	// defer 
	function defer(){
		
	}
	
}));