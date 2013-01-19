var fs = require('fs');

/**
 * Loads a file and returns an Array of the lines in the file.
 * @param {string} path The path to the file to load.
 * @return {Array.<string>}
 */
exports.load = function (path) {
  var file = fs.readFileSync(path);

  return file.toString()
    .split('\n')
    .slice(0, -1);
};
