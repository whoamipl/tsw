String.prototype.supplant = function (data) {
  let output = this;
  Object.entries(data)
		.forEach(([propName, propValue]) => {
			var pattern = new RegExp('{' + propName + '}','g');
			output = output.replace(pattern, propValue);
		})
  return output;
}