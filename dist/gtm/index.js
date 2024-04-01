!function(){function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function t(t){return function(t){if(Array.isArray(t))return e(t)}(t)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(t,n){if(t){if("string"==typeof t)return e(t,void 0);var r=Object.prototype.toString.call(t).slice(8,-1);if("Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return e(t,void 0)}}(t)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}new(function(){var e;function n(e){var t=this;if(!function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}(this,n),this.config={events:{play:!0,pause:!1,complete:!0},percentages:{every:25,each:[0,90]}},!navigator.userAgent.match(/MSIE [678]\./gi)){var r=document.querySelectorAll("lite-vimeo");r&&0!==r.length&&(this.dataLayer=window.dataLayer,this.config=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){var r;r=n[t],t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r})}return e}({},this.config,e),this.cleanConfig(),r.forEach(function(e){e.addEventListener("click",function(){window.dataLayer.push({event:"lite-vimeo-click"}),t.loadVimeoAPI(function(){t.addVimeoListeners(e.shadowRoot.querySelector("iframe"))})})}))}}return e=[{key:"cleanConfig",value:function(){this.setPercentageValuesToArrays(),this.calcPercentages()}},{key:"calcPercentages",value:function(){var e=this.config.percentages.every,n=[];e.forEach(function(e){for(var t=100/e,r=1;r<t;){var o=e*r;r++,o>0&&o<100&&n.push(o)}}),n=t(this.config.percentages.each).concat(t(n)),this.config._track={percentages:n.reduce(function(e,t){return e[t+"%"]=t/100,e},{})}}},{key:"setPercentageValuesToArrays",value:function(){var e=this;t(Object.keys(this.config.percentages)).forEach(function(t){var n=e.config.percentages[t];Array.isArray(n)||(n=[n]),n&&(e.config.percentages[t]=n.map(Number))})}},{key:"loadVimeoAPI",value:function(e){window.Vimeo?e():this.loadScript(e)}},{key:"addVimeoListeners",value:function(e){var t=this,n=new Vimeo.Player(e),r={play:"play",pause:"pause",complete:"ended"};n.getVideoTitle().then(function(e){["play","pause","complete"].forEach(function(o){t.config.events["".concat(o)]&&n.on(r["".concat(o)],function(){t.updateDataLayer(o,e)})});var o,a=null===(o=t.config._track)||void 0===o?void 0:o.percentages;a&&n.on("timeupdate",function(n){var r,o=n.percent;for(r in a)o>=a[r]&&t.updateDataLayer(r,e)})})}},{key:"updateDataLayer",value:function(e,t){-1===e.indexOf("%")&&-1===e.indexOf("play")?this.dataLayer.push({event:"video",video_provider:"vimeo",video_action:e,video_title:t.toLowerCase(),video_percent:void 0}):"0%"===e?this.dataLayer.push({event:"video",video_provider:"vimeo",video_action:"start",video_title:t.toLowerCase(),video_percent:void 0}):-1===e.indexOf("play")&&this.dataLayer.push({event:"video",video_provider:"vimeo",video_action:"progress",video_percent:e,video_title:t.toLowerCase()})}},{key:"loadScript",value:function(e){var t=document.createElement("script");t.onload=function(){e(),t.onload=null},t.src="https://player.vimeo.com/api/player.js",t.async=!0;var n=document.getElementsByTagName("script");if(n.length>0){var r=n[0];r&&r.parentNode&&r.parentNode.insertBefore(t,r)}else document.head.appendChild(t)}}],function(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}(n.prototype,e),n}())}();