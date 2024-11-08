type ConfigObject = {
	eventsToTrack: {
		play: boolean;
		pause: boolean;
		complete: boolean;
	};
	percentages: {
		every: number | number[];
		each: number[];
	};
	_track?: {
		percentages: {
			[key: string]: number;
		};
	};
};

declare global {
	interface Window {
		dataLayer: {}[];
		Vimeo?: Vimeo;
	}
}

export class LiteVimeoGTMTracker {
	dataLayer: Window['dataLayer'];
	config: ConfigObject = {
		eventsToTrack: {
			play: true,
			pause: false,
			complete: true,
		},
		percentages: {
			every: 25,
			each: [0, 90],
		},
	};

	constructor(config: ConfigObject) {
		// The API won't work on LT IE9, so we bail if we detect those User Agents
		if (navigator.userAgent.match(/MSIE [678]\./gi)) return;
		const liteVimeoEls = document.querySelectorAll('lite-vimeo');
		if (!liteVimeoEls || 0 === liteVimeoEls.length) return;

		this.dataLayer = window.dataLayer;
		this.config = { ...this.config, ...config };
		this.cleanConfig();

		liteVimeoEls.forEach((el) => {
			el.addEventListener('click', (ev) => {
				window.dataLayer.push({
					event: 'lite-vimeo-click',
				});

				this.loadVimeoAPI(() => {
					this.addVimeoListeners(el, ev.view);
				});
			});
		});
	}

	/**
	 * Sets up the config object
	 */
	private cleanConfig() {
		this.setPercentageValuesToArrays();
		this.calcPercentages();
	}

	/**
	 * Extends the config object to include _track, which holds a dictionary of percentages and values to track
	 */
	private calcPercentages() {
		let points = this.config.percentages.every as number[];
		let percentagePoints: number[] = [];

		points.forEach((val) => {
			const n = 100 / val; // val = 25, n = 4
			let i = 1;
			while (i < n) {
				const point = val * i;
				i++;
				if (point > 0.0 && point < 100.0) {
					percentagePoints.push(point);
				}
			}
		});

		percentagePoints = [
			...this.config.percentages.each,
			...percentagePoints,
		];

		this.config._track = {
			percentages: percentagePoints.reduce((prev, curr) => {
				prev[curr + '%'] = curr / 100.0;
				return prev;
			}, {}),
		};
	}

	/**
	 * Set every value in the percentages object to an array
	 */
	private setPercentageValuesToArrays() {
		const settings = [...Object.keys(this.config.percentages)];
		settings.forEach((setting) => {
			let values = this.config.percentages[setting];
			if (!Array.isArray(values)) values = [values];
			if (values) {
				this.config.percentages[setting] = values.map(Number);
			}
		});
	}

	/**
	 * If the Vimeo API isn't loaded, load it, then call the callback.
	 * @param {Function} callback
	 */
	private loadVimeoAPI(callback: Function) {
		try {
			if (!window.Vimeo) {
				this.loadVimeoPlayerScript(callback);
			} else {
				callback();
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Wire up the Event listeners for the Vimeo player
	 * @param {Element} el the lite-vimeo component
	 * @param {MouseEvent} ev the lite-vimeo component
	 */
	private addVimeoListeners(el: Element, ev: MouseEvent) {
		const iframe = el.shadowRoot?.querySelector('iframe');
		if (!iframe)
			throw new Error('No iframe found in the lite-vimeo component');
		const video: Vimeo = new ev.Vimeo.Player(iframe);
		const vimeoVideoEvents = {
			play: 'play',
			pause: 'pause',
			complete: 'ended',
		};

		const eventCache: { [key: string]: boolean } = {};
		video.getVideoTitle().then((title) => {
			['play', 'pause', 'complete'].forEach((eventName) => {
				if (this.config.eventsToTrack[`${eventName}`]) {
					video.on(vimeoVideoEvents[`${eventName}`], (ev) => {
						this.updateDataLayer(eventName, title);
					});
				}
			});
			const percentages = this.config._track?.percentages;
			if (percentages) {
				video.on('timeupdate', ({ percent }) => {
					const simplePercent = Number(percent.toPrecision(2));
					for (const key in percentages) {
						if (
							simplePercent === percentages[key] &&
							!eventCache[key]
						) {
							eventCache[key] = true;
							this.updateDataLayer(key, title);
						}
					}
				});
			}
		});
	}

	/**
	 * Updates the GTM dataLayer with the video event
	 * @param action
	 * @param videoTitle
	 */
	private updateDataLayer(action: string, videoTitle: string) {
		if (action.indexOf('%') === -1 && action.indexOf('play') === -1) {
			this.dataLayer.push({
				event: 'video',
				video_provider: 'vimeo',
				video_action: action,
				video_title: videoTitle.toLowerCase(),
				video_percent: undefined,
			});
		} else if (action === '0%' || 'play' === action) {
			this.dataLayer.push({
				event: 'video',
				video_provider: 'vimeo',
				video_action: 'start',
				video_title: videoTitle.toLowerCase(),
				video_percent: undefined,
			});
		} else if (action.indexOf('play') === -1) {
			this.dataLayer.push({
				event: 'video',
				video_provider: 'vimeo',
				video_action: 'progress',
				video_percent: action,
				video_title: videoTitle.toLowerCase(),
			});
		}
	}

	/**
	 * Loads the Vimeo API script before the first script
	 * @param callback {Function} A callback function
	 */
	private loadVimeoPlayerScript(callback: Function) {
		const src = 'https://player.vimeo.com/api/player.js';
		const vimeoPlayerScript = document.createElement('script');
		vimeoPlayerScript.src = src;
		vimeoPlayerScript.async = true;
		vimeoPlayerScript.onload = () => {
			try {
				callback();
			} catch (err) {
				console.error(err);
			}
		};

		const scripts = document.getElementsByTagName('script');
		if (scripts.length > 0) {
			const script = scripts[0];
			if (script && script.parentNode) {
				script.parentNode.insertBefore(vimeoPlayerScript, script);
			}
		} else {
			document.head.appendChild(vimeoPlayerScript);
		}
	}
}
