(function(global, factory){
	// node 
	if (global.module && global.module.exports) {
		factory(module.exports);
	}
	// jpm AMD model
	else if (global.jpm && typeof global.jpm.define === 'function') {
		
	} else {
		// browser
		global.syntax = factory({});
	}
}(this, function(exports){
	// built-in syntax support, [css, js, html]
	// TODO bug issue
}));