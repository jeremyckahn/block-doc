var fs = require('fs');

var R_TRAILING_NEWLINE = /\n$/;

/**
 * Loads a file and returns an Array of the lines in the file.
 * @param {string} path The path to the file to load.
 * @return {Array.<string>}
 */
exports.load = function (path) {
  var file = fs.readFileSync(path);
  var fileString = file.toString();

  try {
    eval(fileString);
  } catch (e) {
    throw 'PARSE_ERROR: ' + path;
  }

  return fileString.replace(R_TRAILING_NEWLINE, '');
};
