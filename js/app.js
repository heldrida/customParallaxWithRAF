function RAFParallax (params) {

	this.throttleDelayMs = 100;
	this.setter(params);

	this.init();

}

RAFParallax.prototype = {

	init: function () {

		this.listeners();
		this.loop();

	},

	setter: function (params) {

		this.container = document.querySelector(params.containerElement);
		this.containerChildElementNodeList = document.querySelectorAll(params.containerChildClassName);
		this.panels = this.getNodeListToArray(this.containerChildElementNodeList);
		this.setBreakpointPositions();

	},

	getNodeListToArray: function (nodeList) {

		return [].slice.call(nodeList);

	},

	setBreakpointPositions: function () {

		this.breakpoints = {};

		this.panels.forEach(function (panel, index) {

			var panelName = panel.getAttribute('data-breakpoint');

			this.breakpoints[panelName] = {
				pos: {
					top: panel.offsetTop,
					bottom: panel.offsetTop + panel.offsetHeight
				},

				callback: function () {
					console.log('callback for ' + panelName + ' is not declared yet!');
				}
			};

		}.bind(this));

	},

	update: function () {


	},

	loop: function () {

		this.update.bind(this);

		requestAnimationFrame(this.loop.bind(this));

	},

	listeners: function () {

		var onScroll = this.throttle(this.onScroll, this.throttleDelayMs);
		document.addEventListener('scroll', onScroll.bind(this));

	},

	onScroll: function () {

		console.log('onScroll');

		var top  = window.pageYOffset || document.documentElement.scrollTop,
			left = window.pageXOffset || document.documentElement.scrollLeft;

		this.breakpointCallbackChecker({
			top: top,
			left: left
		});

	},

	breakpointCallbackChecker: function (params) {

		var bp = null;

		for (var k in this.breakpoints) {

			bp = this.breakpoints[k];

			if (params.top >= bp.pos.top && params.top <= bp.pos.bottom) {

				if (typeof bp.callback === "function") {

					bp.callback();

				}

			}

		}

	},

	// from _underscore lib
	debounce: function (func, wait, immediate) {

		var timeout;

		return function () {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};

	},

	// by Ryan Taylor
	throttle: function (func, ms) {

		var last = 0;

		return function () {

			var a = arguments, t = this, now = +(new Date());

			if (now >= last + ms) {
				last = now;
				func.apply(t, a);
			}

		};

	}

};

(function(){

	var parallax = new RAFParallax({
		containerElement: '.rafp-container',
		containerChildClassName: '.rafp-panel'
	});

	window.parallax = parallax;

})();