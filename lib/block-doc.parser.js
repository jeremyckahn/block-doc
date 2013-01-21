'use strict';

/**
 * @typedef {{
 *   name: string
 * }}
 */
var Metadata;

var R_JSDOC_BLOCK = /\/\*\*[\s\S]*\*\//m;
var R_NAMED_FN_NAME = /function\s*(\w*)/;
var R_ANONYMOUS_FN_NAME = /var\s(\w*)\s*=\s*function/;

/**
 * @param {string} text The contents of a JavaScript file.
 * @return {Array.<metadata>}
 */
exports.getMetadata = function (text) {
  var jsDocBlocks = text.match(R_JSDOC_BLOCK);

  /** @type {Array.<metadata>} */
  var metadataList = [];

  jsDocBlocks.forEach(function (block) {
    var startFrom = text.indexOf(block) + block.length;
    var slicedText = text.slice(startFrom);

    var functionName =
      slicedText.match(R_NAMED_FN_NAME)[1]
      || slicedText.match(R_ANONYMOUS_FN_NAME)[1];

    metadataList.push({
      'name': functionName
    });
  });

  return { methods: metadataList };
};
