(function(){
	var createXHR = function(){
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest;	
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		return null;	
	};
	// wrap ajax support promise
	function XHR(opts){
		this.xhr = createXHR();
		var promise = new Promise(this);
		this.init(opts, promise);
		var that = this;
		['then', 'done'].forEach(function(name){
			that[name] = function(){
				promise[name].apply(promise, arguments);
			}
		});
	}
	// common methods
	XHR.prototype = {
		init: function(opts, promise){
			// ready for send
			opts = opts || {};
			this.xhr.open(opts.method || 'GET', opts.url || '', (opts.async === true || opts.async === undefined));
			this.xhr.setRequestHeader('Content-Type', opts.contentType || 'application/x-www-form-urlencoded');
			typeof opts.beforeSend === 'function' ? opts.beforeSend(this.xhr) : 0;
			// listeners
			bindListeners(promise, this.xhr, opts);
			function bindListeners(promise, xhr, opts){
				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4) {
						if (xhr.status == 200) {
							var response = opts.dataType && typeof opts.dataType === 'string' && opts.dataType.toUpperCase() == 'JSON' ? JSON.parse(xhr.responseText) : xhr.responseText;
							typeof opts.success === 'function' ? opts.success(response, xhr) : 0;
							promise.resolve(response, xhr);
						} else {
							typeof opts.error === 'function' ? opts.error(xhr) : 0;
							promise.reject(xhr);
						}
						typeof opts.always === 'function' ? opts.always(xhr) : 0;
					}	
				};
			}
			// send
			this.xhr.send(opts.data || '');
		}
	};
	window.xhr = function(opts){
		return new XHR(opts);
	};
	// traditional way to call ajax
	(function(){
		if (window.localStorage && localStorage['cook_css_params']) {
			fillContents(JSON.parse(localStorage['cook_css_params']).contents);
			return;
		}
		var xhr = createXHR();
		xhr.open("get", "./params/contents.json");
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var json = JSON.parse(xhr.responseText);
					fillContents(json.contents);
					window.localStorage && (localStorage['cook_css_params'] = xhr.responseText);		
				} else {
					
				}
			}
		};
		xhr.send("");		
	}());
	function fillContents(contents){
		// get visited map from localStorage
		var storageKey = 'cook_css_chapter_visited';
		var visitMap = window.localStorage && window.localStorage[storageKey] ? JSON.parse(localStorage[storageKey]) : {};
		var chapters = document.getElementById('chapters'); 
		for (var i = 0, len = contents.length; i < len; i++) {
			chapters.appendChild(generateChapterElement(contents[i], i, visitMap));
		}
		// addEventListeners
		chapters.addEventListener('click', function(e){
			if (e.srcElement && e.srcElement.tagName.toUpperCase() === 'A') {
				var target = e.srcElement;
				var li = target.parentNode;
				if (li.id && li.id.indexOf('chapter_') === 0) {
					var path = li.id.split('_').slice(1);
					var content = null;
					console.log(path, (content = path.length == 1 ? contents[path[0]] : path.length == 2 ? contents[path[0]].chapters[path[1]] : undefined));
					document.title = content ? content.title || content.name : 'cook css';
					if (window.localStorage) {
						var temp = JSON.parse(localStorage[storageKey] || '{}');
						temp[path.join('_')] = {
							visitTime: new Date().getTime()
						};
						localStorage[storageKey] = JSON.stringify(temp);	
					}
				} else {
					console.log('unknow link');
				}		
			}
		});
	}
	function generateChapterElement(conf, index, visitMap){
		var li = document.createElement('li');
		li.id = 'chapter_' + index;
		li.className = visitMap[index] !== undefined ? 'visited' : ''; 
		var innerHTML = '<a href="#' + (index.toString().replace(/_/g, '/')) + '">' + (conf.title || conf.name) + '</a>';
		li.innerHTML = innerHTML;
		if (conf.chapters && conf.chapters.length) {
			var ul = document.createElement('ul');
			var chapters = conf.chapters;
			for (var i = 0, len = chapters.length; i < len; i+=1) {
				ul.appendChild(generateChapterElement(chapters[i], (index + '_' + i), visitMap));
			}
			li.appendChild(ul);
		}
		return li;
	}
	window.addEventListener('hashchange', hashchangeListener);
	function hashchangeListener(){
		var hash = location.hash.substr(1),
			path2Arr = hash.split('/'),
			section = document.getElementById('section_' + path2Arr.join('_')),
			nodeList = document.getElementById('sections').querySelectorAll('section'),
			i,len;
		for (i = 0, len = nodeList.length; i < len; i += 1) {
			nodeList[i].style.display = 'none';
		}
		if (section != null) {
			section.style.display = 'block';
			return section;
		}
		section = document.createElement('section');		
		section.id = 'section_' + path2Arr.join('_');
		document.getElementById('sections').appendChild(section);
		if (hash) {
			if (hash.indexOf('/') > -1) {
				hash += '.part';
			} else {
				hash += '/referance.part';
			}
			getPart(hash, section);
		}
	};
	function getPart(path, section){
		var xhr = createXHR();
		xhr.open('get', './chapters/' + path);
		xhr.setRequestHeader('Content-Type', 'text/html;charset=utf8');
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					section.innerHTML = formatHTMLPart(xhr.responseText);
				} else {
					section.innerHTML = xhr.status + ' ' + xhr.statusText;
					section.className = 'error';							
				}
			}
		}
		xhr.send('');
	}
	/**
	 * define link paragraph title code image quote tab
	*/
	function formatHTMLPart(htmlPart){
		htmlPart = htmlPart.replace(/\n/g, '<br>');
		return htmlPart;
	}
	/* initial page */
	(function(){
		hashchangeListener();
	}())
}());