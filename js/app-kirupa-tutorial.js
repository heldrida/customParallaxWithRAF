/**
 * A parallax library that uses the request animation frame, breakpoints that trigger custom user functions.
 * @param {object} params { containerElement: '', containerChildClassName: '', breakpointCallbacks: {}}
 */
function RAFParallax (params) {

	this.init(params);

}

RAFParallax.prototype = {

	init: function (params) {

		this.scrolling = false;
		this.mouseWheelActive = false;
		this.mouseDelta = 0;
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

		this.listeners();

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

		window.addEventListener("scroll", this.setScrolling.bind(this), false);

		// deal with the mouse wheel
		window.addEventListener("mousewheel", this.mouseScroll.bind(this), false);
		window.addEventListener("DOMMouseScroll", this.mouseScroll.bind(this), false);

		this.loop();

	},

	setScrolling: function () {

		this.scrolling = true;

	},

	mouseScroll: function (e) {

		this.mouseWheelActive = true;

		// cancel the default scroll behavior
		if (e.preventDefault) {

			e.preventDefault();

		}

		// deal with different browsers calculating the delta differently
		if (e.wheelDelta) {

			this.mouseDelta = e.wheelDelta / 120;

		} else if (e.detail) {

			this.mouseDelta = -e.detail / 3;

		}

	},

	getScrollPosition: function () {

		if (document.documentElement.scrollTop === 0) {

			return document.body.scrollTop;

		} else {

			return document.documentElement.scrollTop;

		}

	},

	setTranslate3DTransform: function  (element, yPosition) {
		var value = "translate3d(0px" + ", " + yPosition + "px" + ", 0)";
		element.style.webkitTransform = value;
	},

	loop: function () {

		// adjust the image's position when scrolling
		if (this.scrolling) {
			this.setTranslate3DTransform(this.scrollWrap, -1 * this.getScrollPosition() / 2);
			this.scrolling = false;
		}

		// scroll up or down by 10 pixels when the mousewheel is used
		if (this.mouseWheelActive) {
			window.scrollBy(0, -this.mouseDelta * 10);
			this.count++;

			// stop the scrolling after a few moments
			if (this.count > 20) {
				this.count = 0;
				this.mouseWheelActive = false;
				this.mouseDelta = 0;
			}
		}

	    requestAnimationFrame(this.loop.bind(this));

	},



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