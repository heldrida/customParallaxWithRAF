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

		this.calculated_scroll_y -= e.wheelDelta;

		if (this.calculated_scroll_y > 0) {
			this.calculated_scroll_y = 0;
		}

		if (Math.abs(parseInt(this.yPosition)) > this.breakpoints['panel-4'].pos.top) {
			this.calculated_scroll_y = (this.breakpoints['panel-4'].pos.top) * -1;
		}

		// deal with different browsers calculating the delta differently
		if (e.wheelDelta) {

			this.mouseDelta = e.wheelDelta;

		} else if (e.detail) {

			this.mouseDelta = -e.detail;

		}

	},

	getScrollPosition: function () {

		this.eased_scroll_y += ( (this.calculated_scroll_y) - this.eased_scroll_y) * this.ease;

		return this.eased_scroll_y;
	},

	setTranslate3DTransform: function  (element, yPosition) {
		var value = "translate3d(0px" + ", " + yPosition + "px" + ", 0)";
		element.style.webkitTransform = value;
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

	}

};

(function(){

	var parallax = new RAFParallax({
		containerElement: '.rafp-container',
		containerChildClassName: '.rafp-panel',
		scrollWrapElement: '.scrollWrap',
		breakpointCallbacks: {
			'panel-1': function () {
				console.log('this is panel-1 callback and does something!');
			},

			'panel-2': function () {
				console.log('this is panel-2 callback and does something!');
			},

			'panel-3': function () {
				console.log('this is panel-3 callback and does something!');
			},

			'panel-4': function () {
				console.log('this is panel-4 callback and does something!');
			},

		}
	});

	window.parallax = parallax;

})();