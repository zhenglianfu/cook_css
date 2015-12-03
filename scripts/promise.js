(function(env, factory){
	if (env.jpm && typeof env.jpm.define === 'function') {
		
	} else if (env.module && typeof module.exports !== 'undefined') {
		factory(module.exports);
	} else {
		env.Promise = factory({}); 
	}
}(this, function(exports){
	var slice = Array.prototype.slice;
	// 实现promise， 不能在外部访问状态机
	function Promise(ins, args){
		var origin = ins || {},
		// local and private variable of Promise
		resolved = null,
		resolve_args = null,
		reject_args = null,
		callbacks = [],
		rejectbacks = [],
		finalbacks = [],
		// 监听队列索引，执行过的监听函数将不再执行
		callbackIndex = 0,
		rejectbackIndex = 0,
		finalbackIndex = 0,
		call_len = 0,
		reject_len = 0,
		final_len = 0,
		triggerAfterResolve = false,
		triggerArgs = null;
		function clearApi(instance){
			instance.resolve = instance.reject = function(){return this;};
		}
		// 结束任务
		function atEnded(instance, result, args){
			clearApi(instance);
			resolved = !!result;
			resolved ? (resolve_args = slice.call(args, 0)) : (reject_args = slice.call(args, 0));
			triggerAfterResolve && instance.trigger.apply(instance, triggerArgs);
			return instance;
		}
		this.status = function(){
			return resolved;
		};
		this.reject = function(){
			return atEnded(this, false, arguments);
		}
		// resolve只能被调用一次，之后加入的handler会被立即执行。
		// [状态机只能变化一次，无法重置]
		this.resolve = function(){
			return atEnded(this, true, arguments);
		};
		this.then = function(fn){
			typeof fn === 'function' ? (callbacks[call_len ++] = fn) : 0;
			return this;
		};
		this.else = function(fn){
			typeof fn === 'function' ? (rejectbacks[reject_len ++] = fn) : 0;
			return this;
		};
		this.resolveHandlerCount = function(){
			return call_len;
		};
		this.rejectHandlerCount = function(){
			return reject_len;	
		};
		this.trigger = function(){
			var args = slice.call(arguments, 0),
				len = 0;
			if (this.status() === true) {
				args = args.concat(resolve_args);
				for (len = call_len; callbackIndex < len; callbackIndex += 1) {
					callbacks[callbackIndex].apply(origin, args);
				}
			} else if (this.status() === false) {
				for (len = rejectbacks.length; rejectbackIndex < len; rejectbackIndex += 1) {
					rejectbacks[rejectbackIndex].apply(origin, reject_args);
				}
			} else {
				triggerAfterResolve = true;
				triggerArgs = args;
			}
			return this;		
		};
		return this;
	};
	Promise.prototype = {
		// if resolve 触发callbacks队列上的函数 else wait or add in callbacks
		done: function(fn){
			this.then(fn);
			this.trigger.apply(this, typeof fn === 'function' ? slice.apply(arguments, [1]) : arguments);
			return this;
		}
	};
	// hold multi promise instances, only all of them resolved, then call the callback
	Promise.when = function(){
		
	}
	// defer publish api to change state of promise
	// seems like an inner class of promise
	function defer(){
			
	}
	return Promise;
}));