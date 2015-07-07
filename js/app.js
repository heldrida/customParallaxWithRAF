function RAFParallax (params) {

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
		this.setBreakpoints();

	},

	getNodeListToArray: function (nodeList) {

		return [].slice.call(nodeList);

	},

	setBreakpoints: function () {

		this.breakpoints = {};

		this.panels.forEach(function (panel, index) {

			this.breakpoints[panel.getAttribute('data-breakpoint')] = panel.offsetTop;

		}.bind(this));

	},

	update: function () {


	},

	loop: function () {

		this.update.bind(this);

		requestAnimationFrame(this.loop.bind(this));

	},

	listeners: function () {

		document.addEventListener('scroll', this.onScroll.bind(this));

	},

	onScroll: function () {

		var top  = window.pageYOffset || document.documentElement.scrollTop,
				left = window.pageXOffset || document.documentElement.scrollLeft;

		console.log('top', top);
		console.log('left', left);

	}

};

(function(){

	var parallax = new RAFParallax({
		containerElement: '.rafp-container',
		containerChildClassName: '.rafp-panel'
	});

	window.parallax = parallax;

})();