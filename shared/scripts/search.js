const POSTS_PER_PAGE = 10;

const SEARCH_SORT = document.getElementById("search_sort");
const SEARCH_TERMS = document.getElementById("search_terms");
const SEARCH_RESULTS = document.getElementById("search_results");
const SEARCH_PAGE = document.getElementById("search_page");
const SEARCH_PAGE_MAX = document.getElementById("search_page_max");
const POST_CONTAINER = document.getElementById("post_container");

var sort;
var results;
var results_num;

search_refresh();

function search_refresh(){
	
	var i = 0;
	const terms = SEARCH_TERMS.value.toLowerCase().split(/,| /);
	sort = SEARCH_SORT.value;
	
	results = [];
	while(i < POSTS.length){
		const post_tags = POSTS[i];
		// We exit if we find a search term that
		// doesn't match any of the post's tags.
		var push = 1;
		var j = 0;
		while(j < terms.length){
			const post_tags_num = post_tags.length-1;
			var match_found = 0;
			var k = 0;
			while(k < post_tags_num){
				if(post_tags[k].includes(terms[j])){
					match_found = 1;
					break;
				}
				++k;
			}
			if(match_found == 0){
				push = 0;
				break;
			}
			++j;
		}
		if(push){
			results.push(i);
		}
		++i;
	}
	results_num = results.length;
	
	SEARCH_RESULTS.innerHTML = results.length + "/" + POSTS.length;
	SEARCH_PAGE.max = Math.max(1, Math.ceil(results.length/POSTS_PER_PAGE));
	SEARCH_PAGE_MAX.innerHTML = SEARCH_PAGE.max;
	SEARCH_PAGE.value = 1;
	
	search_display(1);
	
}

function search_display(){
	
	if(SEARCH_PAGE.value < SEARCH_PAGE.min){
		SEARCH_PAGE.value = SEARCH_PAGE.min;
	}else if(SEARCH_PAGE.value > SEARCH_PAGE.max){
		SEARCH_PAGE.value = SEARCH_PAGE.max;
	}
	const page = SEARCH_PAGE.value-1;
	
	var i = 0;
	POST_CONTAINER.innerHTML = "";
	if(sort == 0){
		const offset = page*POSTS_PER_PAGE;
		while(i < POSTS_PER_PAGE && offset+i < results_num){
			const id = results[offset+i];
			POST_CONTAINER.innerHTML += '<a id="' + POST_ID_PREFIX + POSTS[id].slice(-1) + '" class="post"></a>';
			search_get_post_info(id);
			++i;
		}
	}else if(sort == 1){
		const offset = results_num-1-page*POSTS_PER_PAGE;
		while(i < POSTS_PER_PAGE && offset-i >= 0){
			const id = results[offset-i];
			POST_CONTAINER.innerHTML += '<a id="' + POST_ID_PREFIX + POSTS[id].slice(-1) + '" class="post"></a>';
			search_get_post_info(id);
			++i;
		}
	}
	
}

function search_get_post_info(id){
	var tags = POSTS[id].slice();
	const id_str = tags.pop();
	var xhr = new XMLHttpRequest() || new window.ActiveXObject("Microsoft.XMLHTTP");
	xhr.open("GET", POST_URL_PREFIX + id_str + "/info", true);
	xhr.overrideMimeType("application/json");
	xhr.onreadystatechange = function(){
		if(this.status === 200 && this.readyState === 4){
			const post = document.getElementById(POST_ID_PREFIX + id_str);
			const response = xhr.responseText.replace(/POST_PATH/g, POST_URL_PREFIX + id_str);
			const delimiter = response.indexOf("\n");
			post.href = response.substring(0, delimiter);
			post.innerHTML = response.substring(delimiter+1).replace(/POST_TAGS/g, tags.toString().replace(/,/g, ", "));
			MathJax.typeset();
		}
	};
	xhr.send();
}