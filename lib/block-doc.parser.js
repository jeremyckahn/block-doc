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
 *   params: Array.<Param>
 * }}
 */
var Metadata;

// CONSTANTS
//

var R_JSDOC_BLOCK = /\/\*\*[\s\S]*?\*\//gm;
var R_NAMED_FN_NAME = /function\s*(\w*)/;
var R_ANONYMOUS_FN_VAR_NAME = /var\s(\w*)\s*=\s*function/;
var R_ANONYMOUS_FN_PROPERTY_NAME = /([\w\.]+)(?=.*[:=].*function)/;
var R_PARAM_ANNOTATION = /@param/m;


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
 * @param {string} blockSegment The JSDoc chunk to parse the next param
 * annotation out of.
 * @return {string|null}
 */
function parseNextParamAnnotation (blockSegment) {
  var match = blockSegment.match(R_PARAM_ANNOTATION);
  return match && match[0];
}


/**
 * @param {string} fromBlock The JSDoc block to parse param data from.
 * @return {Array.<Param>}
 */
function parseParams (fromBlock) {
  var params = [];
  var blockVolitileCopy = fromBlock;
  var match;
  while (parseNextParamAnnotation(blockVolitileCopy)) {
    params.push('unimplemented');
    blockVolitileCopy = blockVolitileCopy.replace(R_PARAM_ANNOTATION, '');
  }

  return params;
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
      ,'params': parseParams(block)
    });
  });

  return metadataList;
};

