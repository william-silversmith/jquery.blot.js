/* blot.js
 * 
 * Cartoon blot in and blot out animations.
 *
 * To create a circle expanding outward from a center point:
 *
 * e.g. $.blotOut({ duration, easing }, callback);
 * sometime later...  $.blotOut.off(callback);
 *
 * To create a collapsing annulus that starts at the edges of the 
 * screen and sucks inward to cover everything:
 *
 * $.blotIn({ duration, easing }, callback);
 * $.blotIn.off(callback); // to remove
 *
 * Dependencies: jQuery and jquery.centerIn.js 
 *
 * Developer: William Silversmith 
 * Designer: Alex Norton
 * Date: February 2014
 */

;(function ($, undefined) {

	$.blot = $.blot || {};
	$.blot.defaults = {
		duration: 1500, // msec
		easing: "easeInOutCubic",
	};

	/* blotIn
	 *
	 * Old school style collapsing circle of color
	 * that hides everything in the scene. Think 
	 * looney toons.
	 *
	 * Optional:
	 *   duration: in msec
	 *   easing
	 *   complete: Final callback
	 *
	 * Returns: this
	 */
	$.blotIn = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('<div>').addClass('blot-in');

		var radius = compute_radius();

		blot.css('width', radius).css('height', radius);

		blot.centerIn(window);

		$('body').append(blot);

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			borderWidth: radius / 2 + 1,
		}, duration, easing, complete);

		return this;
	};

	/* blotIn.off
	 *
	 * Animate the removal of the inward blot.
	 *
	 * Optional: Same as blotIn
	 *
	 * Returns: this
	 */
	$.blotIn.off = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('.blot-in');

		var radius = compute_radius();

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			borderWidth: 0,
		}, duration, easing, function () {
			blot.remove();
			complete();
		});

		return this;
	};

	/* blotOut
	 *
	 * Blot out the screen widening from a central point.
	 *
	 * Optional: Same as blotIn
	 *
	 * Returns: this
	 */
	$.blotOut = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('<div>').addClass('blot-out');

		var radius = compute_radius();

		blot.css('width', 1).css('height', 1);

		blot.centerIn(window);

		$('body').append(blot);

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			width: radius + 1,
			height: radius + 1,

		}, {
			duration: duration,
			easing: easing,
			complete: complete,
			step: function () {
				blot.centerIn(window);
			},
		});

		return this;
	};

	/* blotOut.off
	 *
	 * Animate the removal of the blot.
	 *
	 * Optional: Same as blotIn
	 *
	 * Returns: this
	 */
	$.blotOut.off = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('.blot-out');

		var radius = compute_radius();

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			width: 0,
			height: 0,

		}, {
			duration: duration,
			easing: easing,
			complete: function () {
				blot.remove();
				complete();
			},
			step: function () {
				blot.centerIn(window);
			},
		});

		return this;
	};

	/* compute_radius
	 *
	 * Use pythagorean theorem to find radius of circle that circumscribes
	 * the screen. Fucking SATs man.
	 *
	 * Required: None
	 *
	 * Returns: float radius of said circle
	 */
	function compute_radius () {
		var window_w = $(window).innerWidth();
		var window_h = $(window).innerHeight();

		return Math.sqrt(Math.pow(window_w, 2) + Math.pow(window_h, 2));
	}

})(jQuery);


/* jquery.centerIn.js
 *
 * jQuery plugin that allows you to center an element within an element.
 *
 * e.g. 
 *
 * $(element).centerIn(); // centers horizontally and vertically in parent
 * $(element).centerIn(window); // centers horizontally and vertically in window
 * $(element).centerIn(window, { direction: 'vertical' ); // centers vertically in window
 * $(element).centerIn(window, { top: "-20%" }); // centers vertically in window offset upwards by 20%
 * $(element).alwaysCenterIn(window); // deals with resize events
 *
 * Author: William Silversmith
 * Affiliation: Seung Lab, Brain and Cognitive Sciences Dept., MIT
 * Date: August 2013 - February 2014
 */
;(function($, undefined) {

    /* centerIn
     *
     * Centers the element with respect to
     * the first element of the given selector
     * both horizontally and vertically.
     *
     * Required:
     *   [0] selector: The element to center within
     *   [1] options or callback
     *   [2] callback (if [1] is options): Mostly useful for alwaysCenterIn
     *
     * Options:
     *   direction: 'horizontal', 'vertical', or 'both' (default)
     *   top: Additional offset in px
     *   left: Additional offset in px
     *
     * Returns: void
     */
    $.fn.centerIn = function (selector, options, callback) {
        var elements = this;
        options = options || {};

        if (typeof(options) === 'function') {
            callback = options;
            options = {};
        }

        var direction = options.direction || $.fn.centerIn.defaults.direction;
        var extraleft = options.left || 0;
        var extratop = options.top || 0;

        if (selector) {
            selector = $(selector).first();
        }
        else {
            selector = elements.first().parent();
        }

        try {
            if (!selector.css('position') || selector.css('position') === 'static') {
                selector.css('position', 'relative'); 
            }
        }
        catch (e) {
            // selector was something like window, document, html, or body
            // which doesn't have a position attribute
        }

        var horizontal = function (element) {
            var left = Math.round((selector.innerWidth() - element.outerWidth(false)) / 2);
            left += translateDisplacement(selector, extraleft, 'width');
            element.css('left', left + "px");
        };

        var vertical = function (element) {
            var top = Math.round((selector.innerHeight() - element.outerHeight(false)) / 2);
            top += translateDisplacement(selector, extratop, 'height');
            element.css('top', top + "px");
        };

        var centerfn = constructCenterFn(horizontal, vertical, callback, direction);

        elements.each(function (index, element) {
            element = $(element);

            if (element.css("position") !== 'fixed') {
                element.css("position", 'absolute');
            }
            centerfn(element);
        });

        return this;
    };

    /* alwaysCenterIn
     * 
     * Maintains centering even on window resize.
     */
    $.fn.alwaysCenterIn = function () {
        var args = arguments || []; 
        var selector = $(this);

        selector.centerIn.apply(selector, args);

        var evt = 'resize.centerIn';
        if (selector.attr('id')) {
            evt += '.' + selector.attr('id');
        }

        $(window).on(evt, function () {
            selector.centerIn.apply(selector, args);
        });

        return this;
     };

    /* Defaults */

    $.fn.centerIn.defaults = {
        direction: 'both'
    };

    /* translateDisplacement
     *
     * Translates dimensionless units, pixel measures, and percent
     * measures into px.
     *
     * Required: 
     *   [0] selector: Container, relevant for percent measures
     *   [1] value: Amount to displace. e.g. 5, "5px", or "5%"
     *   [2] direction: 'width' or 'height'
     * 
     * Returns: px
     */
    function translateDisplacement(selector, value, direction) {
        if (typeof(value) === 'number') {
            return value;
        }
        else if (/px$/i.test(value)) {
            return parseFloat(value.replace('px', ''), 10);
        }
        else if (/%$/.test(value)) {
            var total = (direction === 'width')
                ? $(selector).innerWidth()
                : $(selector).innerHeight();

            value = parseFloat(value.replace('%', ''), 10);
            value /= 100;

            return value * total;
        }

        return parseFloat(value, 10);
    }

    /* constructCenterFn
     *
     * Constructs an appropriate centering function
     * that includes vertical, horizontal, and callback
     * functions as applicable.
     *
     * Returns: fn
     */
    function constructCenterFn(horizontal, vertical, callback, direction) {
        var fns = []

        if (!direction || direction === 'both') {
            fns.push(vertical);
            fns.push(horizontal);
        }
        else if (direction === 'horizontal') {
            fns.push(horizontal);
        }
        else if (direction === 'vertical') {
            fns.push(vertical);
        }

        if (callback) {
            fns.push(callback);
        }

        return compose(fns);
    }

    /* compose
     *
     * Compose N functions into a single function call.
     *
     * Required: 
     *   [0-n] functions or arrays of functions
     * 
     * Returns: function
     */
    function compose () {
        var fns = flatten(arguments);

        return function () {
            for (var i = 0; i < fns.length; i++) {
                fns[i].apply(this, arguments);
            }
        };
    }

    /* flatten
     *
     * Take an array that potentially contains other arrays 
     * and return them as a single array.
     *
     * e.g. flatten([1, 2, [3, [4]], 5]) => [1,2,3,4,5]
     *
     * Required: 
     *   [0] array
     * 
     * Returns: array
     */
    function flatten (array) {
        array = array || [];

        var flat = [];

        var len = array.length;
        for (var i = 0; i < len; i++) {
            var item = array[i];

            console.log(item, typeof(item));

            if (typeof(item) === 'object' && Array.isArray(item)) {
                flat = flat.concat(flatten(item));
            }
            else {
                flat.push(item);
            }
        } 

        return flat;
    }
})(jQuery);

/* The MIT License (MIT) (for jquery.centerIn.js)

Copyright (c) 2014 Seung Lab, MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/