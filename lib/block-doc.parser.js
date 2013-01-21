'use strict';

// TYPEDEFS
//

/**
 * @typedef {{
 *   name: string,
 *   type: string,
 *   description: string
 * }}
 */
var Param;

/**
 * @typedef {{
 *   name: string,
 *   params: Array
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
 * @private
 */
function getFirstRegExMatch (str, regex) {
  var match = str.match(regex);
  return (match && match[1]) || null;
}


/**
 * @param {string} fromText The text to parse the next function name from.
 * @return {string}
 * @private
 */
function parseFunctionName (fromText) {
  return getFirstRegExMatch(fromText, R_NAMED_FN_NAME) ||
    getFirstRegExMatch(fromText, R_ANONYMOUS_FN_VAR_NAME) ||
    getFirstRegExMatch(fromText, R_ANONYMOUS_FN_PROPERTY_NAME);
}


/**
 * @param {string} text The contents of a JavaScript file.
 * @return {Array.<metadata>}
 */
exports.parseMetadataList = function (text) {
  var jsDocBlocks = text.match(R_JSDOC_BLOCK);

  /** @type {Array.<metadata>} */
  var metadataList = [];

  jsDocBlocks.forEach(function (block) {
    var startFrom = text.indexOf(block) + block.length;
    var slicedText = text.slice(startFrom);
    var functionName = parseFunctionName(slicedText);

    metadataList.push({
      'name': functionName
      ,'params': []
    });
  });

  return metadataList;
};

