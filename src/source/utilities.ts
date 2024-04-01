/**
 * Extends an object with the properties of one or more other objects.
 * @returns {string} A unique identifier
 */
export function extend_(): string {
	var args = [].slice.call(arguments);
	var dst = args.shift();
	var src;
	var key;
	var i;
	for (i = 0; i < args.length; i++) {
		src = args[i];
		for (key in src) {
			dst[key] = src[key];
		}
	}
	return dst;
}

/**
 * Returns true if the object is an array.
 * @param {any} o any thing
 * @returns boolean
 */
export function isArray_(o: any) {
	if (Array.isArray_) return Array.isArray_(o);
	return Object.prototype.toString.call(o) === "[object Array]";
}

/**
 * Iterates over an array and calls a function for each element.
 * @param {Array} arr
 * @param {Function} fn
 * @returns void
 */
export function forEach_(arr: Array<any>, fn: Function) {
	if (Array.prototype.forEach_) return arr.forEach.call(arr, fn);
	var i;
	for (i = 0; i < arr.length; i++) {
		fn.call(window, arr[i], i, arr);
	}
}

/**
 * Maps an array to another array by calling a function for each element.
 * @param {Array} arr
 * @param {Function} fn
 * @returns {Array}
 */
export function map_(arr: Array<any>, fn: Function): Array<any> {
	if (Array.prototype.map_) return arr.map.call(arr, fn);
	var newArr = [];
	forEach_(arr, function (el, ind, arr) {
		newArr.push(fn.call(window, el, ind, arr));
	});
	return newArr;
}

/**
 * Filters an array by calling a function for each element.
 * @param {Array} arr
 * @param {Function} fn
 * @returns {Array}
 */
export function filter_(arr: Array<any>, fn: Function): Array<any> {
	if (Array.prototype.filter) return arr.filter.call(arr, fn);
	var newArr = [];
	forEach_(arr, function (el, ind, arr) {
		if (fn.call(window, el, ind, arr)) newArr.push(el);
	});
	return newArr;
}

/**
 * Reduces an array to a single value by calling a function for each element.
 * @param {Array} arr
 * @param {Function} fn
 * @param {any} init
 * @returns {any}
 */
export function reduce_(arr: Array<any>, fn: Function, init: any): any {
	if (Array.prototype.reduce) return arr.reduce.call(arr, fn, init);
	var result = init;
	var el;
	var i;
	for (i = 0; i < arr.length; i++) {
		el = arr[i];
		result = fn.call(window, result, el, arr, i);
	}
	return result;
}

/**
 * Returns true if the thing is undefined.
 * @param {any} thing
 * @returns boolean
 */
export function isUndefined_(thing: any) {
	return typeof thing === "undefined";
}

/**
 * Selects All tags and returns an array
 * @param {string} tags Any thing
 * @returns {Array}
 */
export function selectAllTags_(tags: string | string[]): Array<any> {
	if (!isArray_(tags)) {
		tags = [tags];
	}
	return [].slice.call(document.querySelectorAll(tags.join()));
}

/**
 * Checks if an el's src is a Vimeo URL
 * @param {HTMLElement} el an HTML Element
 * @returns boolean
 */
export function isVimeo(el: HTMLElement): boolean {
	console.log("checking src of " + el);
	return el.src.indexOf("player.vimeo.com/video/") > -1;
}

export function loadScript(src: string, callback: Function) {
	var f, s;
	f = document.getElementsByTagName("script")[0];
	s = document.createElement("script");
	s.onload = callCallback;
	s.src = src;
	s.async = true;
	f.parentNode.insertBefore(s, f);
	function callCallback() {
		if (callback) {
			callback();
			s.onload = null;
		}
	}
}
