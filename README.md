jquery.blot.js
=======

Cartoony transition effect that blots out the screen.

For an example, see http://veryshare.us and click the button once. Don't worry, nothing will be shared without your permission.

jquery.blot.js requires jquery.centerIn.js. A version of jquery.centerIn.js, courtesy of MIT Seung Lab, is included in this file.

## Examples

var callback = function () {};

// Ring expanding inward

- $.blotIn(callback); // create
- $.blotIn.off(callback); // remove

// Circle expanding outward

- $.blotOut(callback); // create
- $.blotOut.off(callback); // remove

You can also specify alternate durations (in msec) and easings like so:

- $.blotIn({ duration: 2000, easing: "swing" }, callback)

## Additional Work

It would be useful to be able to control the x,y center of the blot.