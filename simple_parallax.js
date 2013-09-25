/*

Author: Benny Chen

*/

;(function($, window, document, undefined) {

	var pluginName     = "simpleParallax",
		defaultOptions = {
			speed: 0.5,
			customFunc: null
		};

	function Plugin(element, options) {
		this.element  = element;
		this.settings = $.extend({}, defaultOptions, options);

		this._defaultOptions = defaultOptions;
		this._name           = pluginName;

		this.init();
	}

	Plugin.prototype = {

		init: function() {
			var $elm = $(this.element);

			this.attachScroll($elm, this.settings);
		},

		attachScroll: function($elm, options) {
			var $window      = $(window),
				windowHeight = $window.height(),
				yPos         = 0,
				offset       = $elm.offset(),
				startPoint   = (offset.top >= windowHeight) ? ($(document).height() - offset.top) : 0,		//element is either in view or not, if not, set the start position
				type         = $elm.data('scroll-type') || 'background';

			$window.scroll(function() {
				var scrolled = $window.scrollTop() - startPoint,		//number of px scrolled
					endPoint = windowHeight * (1 + options.speed);

				//if not in view don't do the calculation
				if($window.scrollTop() < startPoint || scrolled > endPoint) {
					return;
				}

				if(options.customFunc !== null && typeof options.customFunc == 'function') {
					options.customFunc($elm, scrolled, endPoint);
				} else {
					yPos = Math.round(scrolled * options.speed);

					switch(type) {
						case 'element':
							$elm.css({
								top: '-' + yPos + 'px'
							});

							break;

						default:     //default to background
							$elm.css({
								backgroundPosition: '50% -' + yPos + 'px'
							});

							break;
					}
				}
			});
		}

	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);