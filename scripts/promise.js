(function(env, factory){
	if (env.jpm && typeof env.jpm.define === 'function') {
		
	} else if (env.module && typeof module.exports !== 'undefined') {
		factory(module.exports);
	} else {
		env.Promise = factory({}); 
	}
}(this, function(exports){
	// 实现promise， 不能在外部访问状态机
	function Promise(ins, args){
		var origin = ins || {},
		// local and private variable of Promise
		resolved = null,
		callbacks = [],
		errbacks = [],
		call_len = 0,
		err_len = 0;
		function clearApi(instance){
			instance.resolve = instance.reject = function(){return this;};
		}
		this.status = function(){
			return resolved;
		};
		this.reject = function(){
			clearApi(this);
			resolved = false;
		}
		// resolve只能被调用一次，之后加入的handler会被立即执行。
		// [状态机只能变化一次，无法重置]
		this.resolve = function(){
			clearApi(this);
			resolved = true;
			// 执行所有方法，清空callbacks
			for (var i = 0, len = call_len; i < len; i += 1) {
				callbacks[i].apply(origin, arguments); 
				call_len --;
			}			
			callbacks  = [];
			return this;
		};
		this.then = function(fn){
			typeof fn === 'function' ? (callbacks[call_len ++] = fn) : 0;
			return this;
		};
		this.else = function(){
			
		};
		this.size = function(){
			return call_len;
		}
		this.trigger = function(){
			if (this.status()) {
				for (var i = 0, len = call_len; i < len; i += 1) {
					callbacks[i].apply(origin, arguments);
					call_len --;
				}
				callbacks = [];
			}
			return this;		
		};
		return this;
	};
	Promise.prototype = {
		// if resolve 触发callbacks队列上的函数 else wait or add in callbacks
		done: function(fn){
			this.then(fn);
			this.status() && this.trigger.apply(this, arguments);
			return this;
		}
	};
	// defer 
	function defer(){
			
	}
	return Promise;
}));