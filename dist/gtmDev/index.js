(function () {
// import fakeGTM from './utilities/fakeGTM';
// fakeGTM();
class $2668c19cb086d654$export$7e82c3fd8fbe1a4e {
    /**
	 * Sets up the config object
	 */ cleanConfig() {
        this.setPercentageValuesToArrays();
        this.calcPercentages();
    }
    /**
	 * Extends the config object to include _track, which holds a dictionary of percentages and values to track
	 */ calcPercentages() {
        let points = this.config.percentages.every;
        let percentagePoints = [];
        points.forEach((val)=>{
            const n = 100 / val; // val = 25, n = 4
            let i = 1;
            while(i < n){
                const point = val * i;
                i++;
                if (point > 0.0 && point < 100.0) percentagePoints.push(point);
            }
        });
        percentagePoints = [
            ...this.config.percentages.each,
            ...percentagePoints
        ];
        this.config._track = {
            percentages: percentagePoints.reduce((prev, curr)=>{
                prev[curr + "%"] = curr / 100.0;
                return prev;
            }, {})
        };
    }
    /**
	 * Set every value in the percentages object to an array
	 */ setPercentageValuesToArrays() {
        const settings = [
            ...Object.keys(this.config.percentages)
        ];
        settings.forEach((setting)=>{
            let values = this.config.percentages[setting];
            if (!Array.isArray(values)) values = [
                values
            ];
            if (values) this.config.percentages[setting] = values.map(Number);
        });
    }
    /**
	 * If the Vimeo API isn't loaded, load it, then call the callback.
	 * @param {Function} callback
	 */ loadVimeoAPI(callback) {
        if (!window.Vimeo) this.loadScript(callback);
        else callback();
    }
    /**
	 * Wire up the Event listeners for the Vimeo player
	 * @param {HTMLIFrameElement} el
	 */ addVimeoListeners(el) {
        const video = new Vimeo.Player(el);
        const vimeoVideoEvents = {
            play: "play",
            pause: "pause",
            complete: "ended"
        };
        video.getVideoTitle().then((title)=>{
            var _this_config__track;
            [
                "play",
                "pause",
                "complete"
            ].forEach((key)=>{
                if (this.config.events[`${key}`]) video.on(vimeoVideoEvents[`${key}`], ()=>{
                    this.updateDataLayer(key, title);
                });
            });
            const percentages = (_this_config__track = this.config._track) === null || _this_config__track === void 0 ? void 0 : _this_config__track.percentages;
            if (percentages) video.on("timeupdate", ({ percent: percent })=>{
                var key;
                for(key in percentages)if (percent >= percentages[key]) this.updateDataLayer(key, title);
            });
        });
    }
    /**
	 * Updates the GTM dataLayer with the video event
	 * @param action
	 * @param videoTitle
	 */ updateDataLayer(action, videoTitle) {
        if (action.indexOf("%") === -1 && action.indexOf("play") === -1) this.dataLayer.push({
            event: "video",
            video_provider: "vimeo",
            video_action: action,
            video_title: videoTitle.toLowerCase(),
            video_percent: undefined
        });
        else if (action === "0%") this.dataLayer.push({
            event: "video",
            video_provider: "vimeo",
            video_action: "start",
            video_title: videoTitle.toLowerCase(),
            video_percent: undefined
        });
        else if (action.indexOf("play") === -1) this.dataLayer.push({
            event: "video",
            video_provider: "vimeo",
            video_action: "progress",
            video_percent: action,
            video_title: videoTitle.toLowerCase()
        });
    }
    /**
	 * Loads the Vimeo API script before the first script
	 * @param callback {Function} A callback function
	 */ loadScript(callback) {
        const src = "https://player.vimeo.com/api/player.js";
        const vimeoPlayerScript = document.createElement("script");
        vimeoPlayerScript.onload = ()=>{
            callback();
            vimeoPlayerScript.onload = null;
        };
        vimeoPlayerScript.src = src;
        vimeoPlayerScript.async = true;
        const scripts = document.getElementsByTagName("script");
        if (scripts.length > 0) {
            const script = scripts[0];
            if (script && script.parentNode) script.parentNode.insertBefore(vimeoPlayerScript, script);
        } else document.head.appendChild(vimeoPlayerScript);
    }
    constructor(config){
        this.config = {
            events: {
                play: true,
                pause: false,
                complete: true
            },
            percentages: {
                every: 25,
                each: [
                    0,
                    90
                ]
            }
        };
        // The API won't work on LT IE9, so we bail if we detect those User Agents
        if (navigator.userAgent.match(/MSIE [678]\./gi)) return;
        const liteVimeoEls = document.querySelectorAll("lite-vimeo");
        if (!liteVimeoEls || 0 === liteVimeoEls.length) return;
        this.dataLayer = window.dataLayer;
        this.config = {
            ...this.config,
            ...config
        };
        this.cleanConfig();
        liteVimeoEls.forEach((el)=>{
            el.addEventListener("click", ()=>{
                window.dataLayer.push({
                    event: "lite-vimeo-click"
                });
                this.loadVimeoAPI(()=>{
                    this.addVimeoListeners(el.shadowRoot.querySelector("iframe"));
                });
            });
        });
    }
}


(function() {
    "use strict";
    new (0, $2668c19cb086d654$export$7e82c3fd8fbe1a4e)();
})();

})();
//# sourceMappingURL=index.js.map
