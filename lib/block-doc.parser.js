'use strict';

var R_JSDOC_BLOCK = /\/\*\*[\s\S]*\*\//m;

/**
 * @param {string} text The contents of a JavaScript file.
 * @return {Object}
 */
exports.getMetadata = function (text) {
  var jsDocBlocks = text.match(R_JSDOC_BLOCK);
  return { methods: jsDocBlocks };
};
