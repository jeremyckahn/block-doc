'use strict';

// TYPEDEFS
//

/**
 * @typedef {{
 *   name: string
 * }}
 */
var Metadata;

// CONSTANTS
//

var R_JSDOC_BLOCK = /\/\*\*[\s\S]*?\*\//gm;
var R_NAMED_FN_NAME = /function\s*(\w*)/;
var R_ANONYMOUS_FN_VAR_NAME = /var\s(\w*)\s*=\s*function/;
var R_ANONYMOUS_FN_PROPERTY_NAME = /(\w+)(?=.*:.*function)/;


// HELPER METHODS
//

/**
 * @param {string} str The string to test against.
 * @param {RegExp} regex The RegExp to test for.
 * @return {string|null}
 */
function getFirstRegExMatch (str, regex) {
  var match = str.match(regex);
  return (match && match[1]) || null;
}


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
      getFirstRegExMatch(slicedText, R_NAMED_FN_NAME) ||
      getFirstRegExMatch(slicedText, R_ANONYMOUS_FN_VAR_NAME) ||
      getFirstRegExMatch(slicedText, R_ANONYMOUS_FN_PROPERTY_NAME);

    metadataList.push({
      'name': functionName
    });
  });

  return { methods: metadataList };
};

