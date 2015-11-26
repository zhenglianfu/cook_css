(function(){
	var createXHR = function(){
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest;	
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		return null;	
	};
	// traditional way to call ajax
	(function(){
		var xhr = createXHR();
		xhr.open("get", "./params/contents.json");
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var json = JSON.parse(xhr.responseText);
					fillContents(json.contents);		
				} else {
					
				}
			}
		};
		xhr.send("");		
	}());
	function fillContents(contents){
		var chapters = document.getElementById('chapters'); 
		for (var i = 0, len = contents.length; i < len; i++) {
			chapters.appendChild(generateChapterElement(contents[i], i));
		}
	}
	function generateChapterElement(conf, index){
		var li = document.createElement('li');
		li.id = 'chapter_' + index;
		var innerHTML = '<a href="#' + (index.toString().replace(/_/g, '/')) + '">' + (conf.title || conf.name) + '</a>';
		li.innerHTML = innerHTML;
		if (conf.chapters && conf.chapters.length) {
			var ul = document.createElement('ul');
			var chapters = conf.chapters;
			for (var i = 0, len = chapters.length; i < len; i+=1) {
				ul.appendChild(generateChapterElement(chapters[i], (index + '_' + i)));
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
			return;
		}
		if (hash) {
			if (hash.indexOf('/') > -1) {
				hash += '.part';
			} else {
				hash += '/referance.part';
			}
			getPart(hash, path2Arr);
		}
	};
	function getPart(path, pathInContent){
		var xhr = createXHR();
		xhr.open('get', './chapters/' + path);
		xhr.setRequestHeader('Content-Type', 'text/html;charset=utf8');
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				var $body = document.getElementById('sections');
				var section = document.createElement('section');
				section.id = 'section_' + (pathInContent ? pathInContent.join('_') : 'unknow');
				if (xhr.status == 200) {
					section.innerHTML = formatHTMLPart(xhr.responseText);
				} else {
					section.innerHTML = xhr.status + ' ' + xhr.statusText;
					section.className = 'error';							
				}
				$body.appendChild(section);
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
}());