template_set_innerHTML(document.head,
template_sanitize(document.head.innerHTML) +
'<title>Delphinoid\'s Blog</title> \
<link rel="icon" type="image/png" sizes="16x16" href="' + ROOT + '/shared/favicon-16x16.png"> \
<link rel="icon" type="image/png" sizes="32x32" href="' + ROOT + '/shared/favicon-32x32.png"> \
<link rel="stylesheet" href="' + ROOT + '/shared/styles.css"> \
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script> \
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script> \
<script src="' + ROOT + '/shared/scripts/sprite.js"></script>');

template_set_innerHTML(document.body,
'<canvas id="canvas"></canvas> \
	\
	<div id="container"> \
		\
		<div id="header_container"> \
			<span style="font-family:\'cmsy10\'; font-style:normal; line-height: 0px;">D</span><span style="margin-left:-0.1em; position: relative;">elphinoid\'s <span style="font-family:\'cmsy10\'; font-style:normal; line-height: 0px;">B</span>log</span> \
		</div> \
		\
		<div id="navigation_container"> \
			<div id="navigation_padding"></div> \
			<div id="navigation_grid"> \n' +
			((PAGE_TYPE === "home") ?
'			<div style="border-right-style:solid;">Home</div> \
			<a href="' + ROOT + '/blog.html" style="border-right-style:solid;">Blog</a> \
			<a href="' + ROOT + '/art.html" style="border-right-style:solid;">Art</a> \
			<a href="' + ROOT + '/research.html">Research</a> \n' :
			((PAGE_TYPE == "blog") ?
'			<a href="' + ROOT + '/index.html" style="border-right-style:solid;">Home</a> \
			<div style="border-right-style:solid;">Blog</div> \
			<a href="' + ROOT + '/art.html" style="border-right-style:solid;">Art</a> \
			<a href="' + ROOT + '/research.html">Research</a> \n' :
			((PAGE_TYPE == "art") ?
'			<a href="' + ROOT + '/index.html" style="border-right-style:solid;">Home</a> \
			<a href="' + ROOT + '/blog.html" style="border-right-style:solid;">Blog</a> \
			<div style="border-right-style:solid;">Art</div> \
			<a href="' + ROOT + '/research.html">Research</a> \n' :
			((PAGE_TYPE == "research") ?
'			<a href="' + ROOT + '/index.html" style="border-right-style:solid;">Home</a> \
			<a href="' + ROOT + '/blog.html" style="border-right-style:solid;">Blog</a> \
			<a href="' + ROOT + '/art.html" style="border-right-style:solid;">Art</a> \
			<div>Research</div> \n' : 
'			<a href="' + ROOT + '/index.html" style="border-right-style:solid;">Home</a> \
			<a href="' + ROOT + '/blog.html" style="border-right-style:solid;">Blog</a> \
			<a href="' + ROOT + '/art.html" style="border-right-style:solid;">Art</a> \
			<a href="' + ROOT + '/research.html">Research</a> \n')))) +
'			</div> \
			<div id="navigation_padding"></div> \
		</div> \
		\
		<div id="content_container">\n' +
			((typeof POSTS !== "undefined") ?
'			<div id="search_header"> \
				<span class="search"> \
					Results: <span id="search_results">1/1</span>&nbsp; \
					<select id="search_sort"> \
						<option value=0>Newest</option> \
						<option value=1>Oldest</option> \
					</select> \
					<input id="search_terms" type="text" placeholder="Search"> \
					<button id="search_submit" onclick="search_refresh()">&#x1F50E;&#xFE0E;</button> \
				</span> \
			</div> \
			<div id="post_container"> \
			</div> \
			<div style="margin-top: 63px"></div> \
			<div id="search_footer"> \
				<span class="search"> \
					Page: <input id="search_page" type="number" onchange="search_display()" min=1 max=1 value=1>/<span id="search_page_max">1</span> \
				</span> \
			</div>\n'
			: '') +
			template_sanitize(document.body.innerHTML) +
'		</div> \
		\
	<div id="footer_container"></div> \
	\
</div> \
\
' + ((typeof POSTS !== "undefined") ? '<script src="' + ROOT + '/shared/scripts/search.js"></script>\n' : '') +
'<script src="' + ROOT + '/shared/scripts/background.js"></script>');

function template_sanitize(html){
	return html.replace(/<script.*script>/g, '')
}

function template_set_innerHTML(element, html){
	
	element.innerHTML = html;
	
	const scripts = Array.from(element.querySelectorAll("script"));
	
	var i = 0;
    while(i < scripts.length){
		
		const new_script = document.createElement("script");
		const old_script = scripts[i];
		const old_script_attributes = old_script.attributes;
		const old_script_attributes_num = old_script_attributes.length;
		
		var j = 0;
		while(j < old_script.attributes.length){
			new_script.setAttribute(old_script.attributes[j].name, old_script.attributes[j].value);
			++j;
		}
		
		new_script.appendChild(document.createTextNode(old_script.innerHTML));
		old_script.parentNode.replaceChild(new_script, old_script);
		++i;
	
	}
	
}