(function () {
function $ab3a094495a865ee$export$2996f80ef42b8419(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}


function $82d543bfa7800537$var$_defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function $82d543bfa7800537$export$d60067ff2358eee8(Constructor, protoProps, staticProps) {
    if (protoProps) $82d543bfa7800537$var$_defineProperties(Constructor.prototype, protoProps);
    if (staticProps) $82d543bfa7800537$var$_defineProperties(Constructor, staticProps);
    return Constructor;
}


function $a15628583efdb184$export$1e71eb4bef00f6b0(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}


function $85f6ad08075140fa$export$581ff339ea0ba762(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
        ownKeys.forEach(function(key) {
            (0, $a15628583efdb184$export$1e71eb4bef00f6b0)(target, key, source[key]);
        });
    }
    return target;
}


function $36ca941bce93f1c7$export$79e617b1955a2616(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}


function $b84912ad86c9ce6f$export$7e0947b5ad3404e2(arr) {
    if (Array.isArray(arr)) return (0, $36ca941bce93f1c7$export$79e617b1955a2616)(arr);
}


function $b424a9abf016e439$export$1eb58a6e75231000(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}


function $1f2ccb10d71bd45a$export$e6f3c4780d19eb2b() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}



function $cfc31108d06efd09$export$a5be06335b3a083c(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return (0, $36ca941bce93f1c7$export$79e617b1955a2616)(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0, $36ca941bce93f1c7$export$79e617b1955a2616)(o, minLen);
}


function $34618e712334dec5$export$1b5e630bc3aea29f(arr) {
    return (0, $b84912ad86c9ce6f$export$7e0947b5ad3404e2)(arr) || (0, $b424a9abf016e439$export$1eb58a6e75231000)(arr) || (0, $cfc31108d06efd09$export$a5be06335b3a083c)(arr) || (0, $1f2ccb10d71bd45a$export$e6f3c4780d19eb2b)();
}


var $104a421c1b113c85$export$7e82c3fd8fbe1a4e = /*#__PURE__*/ function() {
    "use strict";
    function LiteVimeoGTMTracker(config) {
        var _this = this;
        (0, $ab3a094495a865ee$export$2996f80ef42b8419)(this, LiteVimeoGTMTracker);
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
        var liteVimeoEls = document.querySelectorAll("lite-vimeo");
        if (!liteVimeoEls || 0 === liteVimeoEls.length) return;
        this.dataLayer = window.dataLayer;
        this.config = (0, $85f6ad08075140fa$export$581ff339ea0ba762)({}, this.config, config);
        this.cleanConfig();
        liteVimeoEls.forEach(function(el) {
            el.addEventListener("click", function() {
                window.dataLayer.push({
                    event: "lite-vimeo-click"
                });
                _this.loadVimeoAPI(function() {
                    var _el_shadowRoot;
                    _this.addVimeoListeners((_el_shadowRoot = el.shadowRoot) === null || _el_shadowRoot === void 0 ? void 0 : _el_shadowRoot.querySelector("iframe"));
                });
            });
        });
    }
    (0, $82d543bfa7800537$export$d60067ff2358eee8)(LiteVimeoGTMTracker, [
        {
            key: "cleanConfig",
            value: /**
	 * Sets up the config object
	 */ function cleanConfig() {
                this.setPercentageValuesToArrays();
                this.calcPercentages();
            }
        },
        {
            key: "calcPercentages",
            value: /**
	 * Extends the config object to include _track, which holds a dictionary of percentages and values to track
	 */ function calcPercentages() {
                var points = this.config.percentages.every;
                var percentagePoints = [];
                points.forEach(function(val) {
                    var n = 100 / val; // val = 25, n = 4
                    var i = 1;
                    while(i < n){
                        var point = val * i;
                        i++;
                        if (point > 0.0 && point < 100.0) percentagePoints.push(point);
                    }
                });
                percentagePoints = (0, $34618e712334dec5$export$1b5e630bc3aea29f)(this.config.percentages.each).concat((0, $34618e712334dec5$export$1b5e630bc3aea29f)(percentagePoints));
                this.config._track = {
                    percentages: percentagePoints.reduce(function(prev, curr) {
                        prev[curr + "%"] = curr / 100.0;
                        return prev;
                    }, {})
                };
            }
        },
        {
            key: "setPercentageValuesToArrays",
            value: /**
	 * Set every value in the percentages object to an array
	 */ function setPercentageValuesToArrays() {
                var _this = this;
                var settings = (0, $34618e712334dec5$export$1b5e630bc3aea29f)(Object.keys(this.config.percentages));
                settings.forEach(function(setting) {
                    var values = _this.config.percentages[setting];
                    if (!Array.isArray(values)) values = [
                        values
                    ];
                    if (values) _this.config.percentages[setting] = values.map(Number);
                });
            }
        },
        {
            key: "loadVimeoAPI",
            value: /**
	 * If the Vimeo API isn't loaded, load it, then call the callback.
	 * @param {Function} callback
	 */ function loadVimeoAPI(callback) {
                if (!window.Vimeo) this.loadScript(callback);
                else callback();
            }
        },
        {
            key: "addVimeoListeners",
            value: /**
	 * Wire up the Event listeners for the Vimeo player
	 * @param {HTMLIFrameElement} el
	 */ function addVimeoListeners(el) {
                var _this = this;
                var video = new Vimeo.Player(el);
                var vimeoVideoEvents = {
                    play: "play",
                    pause: "pause",
                    complete: "ended"
                };
                /**
		 * Cache for the percentage events
		 * @type {{[key: string]: boolean}}
		 */ var eventCache = {};
                video.getVideoTitle().then(function(title) {
                    var _this_config__track;
                    [
                        "play",
                        "pause",
                        "complete"
                    ].forEach(function(key) {
                        if (_this.config.events["".concat(key)]) video.on(vimeoVideoEvents["".concat(key)], function() {
                            _this.updateDataLayer(key, title);
                        });
                    });
                    var percentages = (_this_config__track = _this.config._track) === null || _this_config__track === void 0 ? void 0 : _this_config__track.percentages;
                    if (percentages) video.on("timeupdate", function(param) {
                        var percent = param.percent;
                        var simplePercent = Number(percent.toPrecision(2));
                        for(var key in percentages)if (simplePercent === percentages[key] && !eventCache[key]) {
                            eventCache[key] = true;
                            _this.updateDataLayer(key, title);
                            console.log(_this.dataLayer);
                        }
                    });
                });
            }
        },
        {
            key: "updateDataLayer",
            value: /**
	 * Updates the GTM dataLayer with the video event
	 * @param action
	 * @param videoTitle
	 */ function updateDataLayer(action, videoTitle) {
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
        },
        {
            key: "loadScript",
            value: /**
	 * Loads the Vimeo API script before the first script
	 * @param callback {Function} A callback function
	 */ function loadScript(callback) {
                var src = "https://player.vimeo.com/api/player.js";
                var vimeoPlayerScript = document.createElement("script");
                vimeoPlayerScript.onload = function() {
                    callback();
                    vimeoPlayerScript.onload = null;
                };
                vimeoPlayerScript.src = src;
                vimeoPlayerScript.async = true;
                var scripts = document.getElementsByTagName("script");
                if (scripts.length > 0) {
                    var script = scripts[0];
                    if (script && script.parentNode) script.parentNode.insertBefore(vimeoPlayerScript, script);
                } else document.head.appendChild(vimeoPlayerScript);
            }
        }
    ]);
    return LiteVimeoGTMTracker;
}();


(function() {
    "use strict";
    new (0, $104a421c1b113c85$export$7e82c3fd8fbe1a4e)();
})();

})();
//# sourceMappingURL=index.js.map
