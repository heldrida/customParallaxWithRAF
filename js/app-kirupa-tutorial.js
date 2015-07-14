/**
 * A parallax library that uses the request animation frame, breakpoints that trigger custom user functions.
 * @param {object} params { containerElement: '', containerChildClassName: '', breakpointCallbacks: {}}
 */
function RAFParallax (params) {

	this.init(params);

}

RAFParallax.prototype = {

	init: function (params) {

		window.scroll(0, 0);

		this.scrollLock = false;
		this.scrolling = false;
		this.mouseWheelActive = false;
		this.mouseDelta = 0;
		this.calculated_scroll_y = 0;
		this.count = 0;
		/*
		this.requestAnimationFrame =	window.requestAnimationFrame ||
										window.mozRequestAnimationFrame ||
										window.webkitRequestAnimationFrame ||
										window.msRequestAnimationFrame;
										*/
		this.transforms = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
		this.transformProperty = this.getSupportedPropertyName(this.transforms);
		this.container = document.querySelector(params.containerElement);
		this.scrollWrap = document.querySelector(params.scrollWrapElement);
		this.eased_scroll_y = 0;
		this.ease = 0.25;
		this.containerChildElementNodeList = document.querySelectorAll(params.containerChildClassName);
		this.panels = this.getNodeListToArray(this.containerChildElementNodeList);
		this.breakpoints = {};
		this.breakpointCallbacks = params.breakpointCallbacks;
		this.setBreakpointPositions();

		this.resize();
		this.listeners();

	},

	resize: function () {

		this.container.style.width = window.innerWidth + 'px';
		this.container.style.height = window.innerHeight + 'px';
		this.container.style.overflow = 'hidden';

	},

	// vendor prefix management
	getSupportedPropertyName: function (properties) {
		for (var i = 0; i < properties.length; i++) {
			console.log(properties[i]);
			if (typeof document.body.style[properties[i]] !== "undefined") {
				return properties[i];
			}
		}
		return null;
	},

	listeners: function () {

		// deal with the mouse wheel
		window.addEventListener("mousewheel", this.mouseScroll.bind(this), false);
		window.addEventListener("DOMMouseScroll", this.mouseScroll.bind(this), false);

		this.loop();

	},

	mouseScroll: function (e) {

		// cancel the default scroll behavior
		if (e.preventDefault) {
			e.preventDefault();
		}

		var d = this.wheel(e);

		this.calculated_scroll_y -= d;

		if (this.calculated_scroll_y > 0) {
			this.calculated_scroll_y = 0;
		}

		if (Math.abs(parseInt(this.yPosition)) > this.breakpoints['panel-4'].pos.top) {
			this.calculated_scroll_y = (this.breakpoints['panel-4'].pos.top) * -1;
		}

		// deal with different browsers calculating the delta differently
		this.mouseDelta = d;

	},

	getScrollPosition: function () {

		this.eased_scroll_y += ( (this.calculated_scroll_y) - this.eased_scroll_y) * this.ease;

		return this.eased_scroll_y;
	},

	setTranslate3DTransform: function  (element, yPosition) {

		var value = "translate3d(0px" + ", " + yPosition + "px" + ", 0)";

		element.style[this.transformProperty] = value;

	},

	loop: function () {

		var yPosition = this.getScrollPosition();

		// adjust scroll wrap when scrolling
		this.setTranslate3DTransform(this.scrollWrap, yPosition);

		this.yPosition = yPosition;

		this.breakpointCallbackChecker();

	    requestAnimationFrame(this.loop.bind(this));
	},

	setBreakpointPositions: function () {

		this.panels.forEach(function (panel, index) {

			var panelName = panel.getAttribute('data-breakpoint');

			this.breakpoints[panelName] = {

				pos: {
					top: panel.offsetTop,
					bottom: panel.offsetTop + panel.offsetHeight
				},

				callback: typeof this.breakpointCallbacks[panelName] === "function" ? this.breakpointCallbacks[panelName] : null,

				width: panel.offsetWidth,

				height: panel.offsetHeight,

				el: panel

			};

		}.bind(this));

	},

	breakpointCallbackChecker: function () {

		var bp = null,
			y = Math.abs(this.yPosition);

		for (var k in this.breakpoints) {

			bp = this.breakpoints[k];

			if (y >= bp.pos.top && y <= bp.pos.bottom) {

				if (typeof bp.callback === "function") {

					bp.callback(this);

				}

			}

		}

	},

	getNodeListToArray: function (nodeList) {

		return [].slice.call(nodeList);

	},

	getPercentage: function (a, b) {

		return (a / b) * 100;

	},

	/*
	* Orginal: http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
	*/
	wheel: function (event) {

	    var normalized;

	    if (event.wheelDelta) {

	        normalized = (event.wheelDelta % 120 - 0) == -0 ? event.wheelDelta / 120 : event.wheelDelta / 12;

	    } else {

	        var rawAmmount = event.deltaY ? event.deltaY : event.detail;
	        normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);

	    }

	    return normalized;

	}

};

(function(){

	var parallax = new RAFParallax({
		containerElement: '.rafp-container',
		containerChildClassName: '.rafp-panel',
		scrollWrapElement: '.scrollWrap',
		breakpointCallbacks: {
			'panel-1': function (context) {
				//console.log('this is panel-1 callback and does something!');

				var y = Math.abs(context.yPosition),
					panel = context.breakpoints['panel-1'].el,
					col = panel.querySelector('.col'),
					panelHeight = panel.offsetHeight,
					percentage = Math.ceil(context.getPercentage(y, panelHeight)),
					value = '';

				if (percentage <= 100) {

					context.scrollLock = true;

					// animate column
					col.style[context.transformProperty] = "translate3d(" + (-1 * percentage) + "%, 0, 0)";

					panel.style[context.transformProperty] = "translate3d(0px, " + -1 * context.yPosition + "px, 0px)";

				} else {

					context.scrollLock = false;

					col.style[context.transformProperty] = "translate3d(-100%, 0, 0)";

					panel.style[context.transformProperty] = "translate3d(0px, " + context.yPosition + "px, 0px)";

				}

			},

			'panel-2': function (context) {

				console.log('this is panel-2 callback and does something!');

			},

			'panel-3': function (context) {
				console.log('this is panel-3 callback and does something!');
			},

			'panel-4': function (context) {
				console.log('this is panel-4 callback and does something!');
			},

		}
	});

	window.parallax = parallax;

})();