import {
	filter_,
	forEach_,
	map_,
	isArray_,
	isUndefined_,
	reduce_,
	isVimeo,
	extend_,
	selectAllTags_,
	loadScript,
} from './utilities';

/*
 * v1.0.1
 * Created by the Google Analytics consultants at http://www.lunametrics.com
 * Written by @notdanwilkerson
 * Documentation: https://github.com/lunametrics/vimeo-google-analytics/
 * Licensed under the MIT License
 * Modified by Julius Fedorovicius at https://www.analyticsmania.com
 * @see https://www.analyticsmania.com/post/track-videos-with-google-analytics-4-and-google-tag-manager/#vimeo-listener
 */
(function (document, window, config) {
	'use strict';

	// The API won't work on LT IE9, so we bail if we detect those UAs

	if (navigator.userAgent.match(/MSIE [678]\./gi)) return;
	config = cleanConfig(config);

	var handle = getHandler(config.syntax);
	if (document.readyState !== 'loading') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', function () {
			init();
			document.addEventListener('load', init, true);
		});
	}

	function init() {
		var videos = filter_(selectAllTags_('iframe'), isVimeo);
		if (!videos.length) return;
		loadApi(function () {
			forEach_(videos, listenTo);
		});
	}

	function loadApi(callback) {
		if (isUndefined_(window.Vimeo)) {
			loadScript('https://player.vimeo.com/api/player.js', callback);
		} else {
			callback();
		}
	}

	function listenTo(el) {
		if (el.__vimeoTracked) return;
		el.__vimeoTracked = true;
		var video = new Vimeo.Player(el);
		var percentages = config._track.percentages;
		var eventNameDict = {
			play: 'play',
			pause: 'pause',
			complete: 'ended',
		};
		var cache = {};
		video.getVideoTitle().then(function (title) {
			forEach_(['play', 'pause', 'complete'], function (key) {
				if (config.events[key]) {
					video.on(eventNameDict[key], function () {
						handle(key, title);
					});
				}
			});
			if (percentages) {
				video.on('timeupdate', function (evt) {
					var percentage = evt.percent;
					var key;
					for (key in percentages) {
						if (percentage >= percentages[key] && !cache[key]) {
							cache[key] = true;
							handle(key, title);
						}
					}
				});
			}
		});
	}

	function cleanConfig(config) {
		config = extend_(
			{},
			{
				events: {
					play: true,
					pause: true,
					complete: true,
				},
				percentages: {
					each: [],
					every: [],
				},
			},
			config
		);
		forEach_(['each', 'every'], function (setting) {
			var vals = config.percentages[setting];
			if (!isArray_(vals)) vals = [vals];
			if (vals) config.percentages[setting] = map_(vals, Number);
		});
		var points = [].concat(config.percentages.each);
		if (config.percentages.every) {
			forEach_(config.percentages.every, function (val) {
				var n = 100 / val;
				var every = [];
				var i;
				for (i = 1; i < n; i++) every.push(val * i);
				points = points.concat(
					filter_(every, function (val) {
						return val > 0.0 && val < 100.0;
					})
				);
			});
		}
		var percentages = reduce_(
			points,
			function (prev, curr) {
				prev[curr + '%'] = curr / 100.0;
				return prev;
			},
			{}
		);
		config._track = {
			percentages: percentages,
		};
		return config;
	}

	function getHandler(syntax) {
		syntax = syntax || {};
		var gtmGlobal = syntax.name || 'dataLayer';
		var uaGlobal = syntax.name || window.GoogleAnalyticsObject || 'ga';
		var clGlobal = '_gaq';
		var dataLayer;
		var handlers = {
			gtm: function (state, title) {
				if (state.indexOf('%') === -1 && state.indexOf('play') === -1) {
					dataLayer.push({
						event: 'video',
						video_provider: 'vimeo',
						video_action: state,
						video_title: title.toLowerCase(),
						video_percent: undefined,
					});
				} else if (state === '0%') {
					dataLayer.push({
						event: 'video',
						video_provider: 'vimeo',
						video_action: 'start',
						video_title: title.toLowerCase(),
						video_percent: undefined,
					});
				} else if (state.indexOf('play') === -1) {
					dataLayer.push({
						event: 'video',
						video_provider: 'vimeo',
						video_action: 'progress',
						video_percent: state,
						video_title: title.toLowerCase(),
					});
				}
			},
			cl: function (state, title) {
				window[clGlobal].push(['_trackEvent', 'Videos', state, title]);
			},
			ua: function (state, title) {
				window[uaGlobal]('send', 'event', 'Videos', state, title);
			},
		};
		switch (syntax.type) {
			case 'gtm':
				dataLayer = window[gtmGlobal] = window[gtmGlobal] || [];
				break;
			case 'ua':
				window[uaGlobal] =
					window[uaGlobal] ||
					function () {
						(window[uaGlobal].q = window[uaGlobal].q || []).push(
							arguments
						);
					};
				window[uaGlobal].l = +new Date();
				break;
			case 'cl':
				window[clGlobal] = window[clGlobal] || [];
				break;
			default:
				if (!isUndefined_(window[gtmGlobal])) {
					syntax.type = 'gtm';
					dataLayer = window[gtmGlobal] = window[gtmGlobal] || [];
				} else if (uaGlobal && !isUndefined_(window[uaGlobal])) {
					syntax.type = 'ua';
				} else if (
					!isUndefined_(window[clGlobal]) &&
					!isUndefined_(window[clGlobal].push)
				) {
					syntax.type = 'cl';
				}
				break;
		}
		return handlers[syntax.type];
	}
})(document, window, {
	events: {
		play: true,
		pause: false,
		complete: true,
	},
	percentages: {
		every: 25,
		each: [0, 90],
	},
});
