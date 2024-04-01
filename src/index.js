import { LiteVimeoGTMTracker } from "./class-lite-vimeo-gtm-tracker";

(function () {
	"use strict";
	new LiteVimeoGTMTracker(document, window, {
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
})();
