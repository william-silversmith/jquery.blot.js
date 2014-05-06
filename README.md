jquery.blot.js
=======

Cartoony transition effect that blots out the screen.

For an example, see http://veryshare.us and click the button once. Don't worry, nothing will be shared without your permission.

jquery.blot.js requires jquery.centerIn.js. A version of jquery.centerIn.js, courtesy of MIT Seung Lab, is included in this repo. jquery.blot.min.js concatenates them together in the minified file.

## Examples

- $.blotIn(function () { /* no op */ }); // create
- $.blotIn.off(function () { /* no op */ }); // remove

- $.blotOut(function () { /* no op */ }); // create
- $.blotOut.off(function () { /* no op */ }); // remove

## Additional Work

It would be useful to be able to control the x,y center of the blot.