import { isVimeo, loadScript } from './source/utilities';
import fakeGTM from './utilities/fakeGTM';

fakeGTM();

type ConfigObject = {
	events: {
		play: boolean;
		pause: boolean;
		complete: boolean;
	};
	percentages: {
		every: number;
		each: number[];
	};
	_track: {
		percentages: {};
	};
};

declare global {
	interface Window {
		dataLayer: {}[];
		Vimeo?: Vimeo;
	}
}

export class LiteVimeoGTMTracker {
	document: Document;

	window: Window;

	config: ConfigObject;

	handle: CallableFunction;

	constructor(document: Document, window: Window, config: ConfigObject) {
		this.document = document;
		this.window = window;
		this.config = config;
		this.cleanConfig();
		this.handle = !config.syntax
			? this.getHandler()
			: this.getHandler(config.syntax);

		// The API won't work on LT IE9, so we bail if we detect those User Agents
		if (navigator.userAgent.match(/MSIE [678]\./gi)) return;

		const liteVimeoEls = document.querySelectorAll('lite-vimeo');
		if (!liteVimeoEls || 0 === liteVimeoEls.length) return;
		liteVimeoEls.forEach((el) => {
			el.addEventListener('click', () => {
				window.dataLayer.push({
					event: 'lite-vimeo-click',
				});
				this.loadVimeoAPI(() => {
					this.listenTo(
						el.shadowRoot.querySelector(
							'iframe'
						) as HTMLIFrameElement
					);
				});
			});
		});
	}

	/**
	 * Sets up the config object
	 */
	private cleanConfig() {
		[Object.keys(this.config.percentages)].forEach((setting) => {
			let values = this.config.percentages[`${setting}`];
			if (!Array.isArray(values)) values = [values];
			if (values) {
				this.config.percentages[`${setting}`] = values.map(Number);
			}
		});

		let percentagePoints = [...this.config.percentages.each];
		if (this.config.percentages.every) {
			[this.config.percentages.every].forEach(function (val) {
				var n = 100 / val;
				let every: number[] = [];
				for (let i = 1; i < n; i++) every.push(val * i);
				percentagePoints = percentagePoints.concat(
					every.filter((val) => val > 0.0 && val < 100.0)
				);
			});
		}
		const percentages = percentagePoints.reduce(function (prev, curr) {
			prev[curr + '%'] = curr / 100.0;
			return prev;
		}, {});
		this.config._track = {
			percentages: percentages,
		};
	}

	/**
	 * If the Vimeo API isn't loaded, load it, then call the callback.
	 * @param {Function} callback
	 */
	private loadVimeoAPI(callback: Function) {
		if (!window.Vimeo) {
			loadScript('https://player.vimeo.com/api/player.js', callback);
		} else {
			callback();
		}
	}

	/**
	 * Wire up the Event listener
	 * @param {HTMLIFrameElement} el
	 * @returns
	 */
	private async listenTo(el: HTMLIFrameElement) {
		console.log('listening...');
		if (el.__vimeoTracked) return;
		el.__vimeoTracked = true;
		const video: Vimeo = new Vimeo.Player(el);
		const {
			_track: { percentages },
		} = this.config;
		const eventNameDict = {
			play: 'play',
			pause: 'pause',
			complete: 'ended',
		};
		const cache = {};
		const title = await video.getVideoTitle();
		['play', 'pause', 'complete'].forEach((key) => {
			if (this.config.events[`${key}`]) {
				console.log(eventNameDict[`${key}`]);
				video.on(eventNameDict[`${key}`], () => {
					this.handle(key, title);
					console.log(window.dataLayer);
				});
			}
		});

		if (percentages) {
			video.on('timeupdate', function (evt) {
				var percentage = evt.percent;
				var key: string | number;
				for (key in percentages) {
					if (percentage >= percentages[key] && !cache[key]) {
						cache[key] = true;
						this.handle(key, title);
					}
				}
			});
		}
	}

	private getHandler(syntax = {}) {
		var gtmGlobal = syntax.name || 'dataLayer';
		var uaGlobal = syntax.name || window.GoogleAnalyticsObject || 'ga';
		var clGlobal = '_gaq';
		var dataLayer:
			| Window
			| {
					event: string;
					video_provider: string;
					video_action: any;
					video_title: any;
					video_percent: any;
			  }[];
		var handlers = {
			gtm: function (state: string | string[], title: string) {
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
			cl: function (state: any, title: any) {
				window[clGlobal].push(['_trackEvent', 'Videos', state, title]);
			},
			ua: function (state: any, title: any) {
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
				if (!window[gtmGlobal]) {
					syntax.type = 'gtm';
					dataLayer = window[gtmGlobal] = window[gtmGlobal] || [];
				} else if (uaGlobal && !window[uaGlobal]) {
					syntax.type = 'ua';
				} else if (!window[clGlobal] && !window[clGlobal].push) {
					syntax.type = 'cl';
				}
				break;
		}
		return handlers[syntax.type];
	}
}
