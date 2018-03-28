/* jshint strict: global, devel: true, esversion: 6 */
'use strict';
String.prototype.supplant = function (data) {
  let output = this;
  Object.entries(data)
		.forEach(([propName, propValue]) => {
			var pattern = new RegExp('{' + propName + '}','g');
			output = output.replace(pattern, propValue);
		});
  return output;
};

var test = '<h2>{replaceThis}</h2> Some sample text {andThis}';
var data = {
	replaceThis: 'replaced',
	andThis: 'this too'
};

console.log(test.supplant(data));