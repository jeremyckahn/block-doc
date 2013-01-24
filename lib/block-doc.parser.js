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

var PARAM = '@param';
var R_JSDOC_BLOCK = /\/\*\*[\s\S]*?\*\//gm;
var R_NAMED_FN_NAME = /function\s*(\w*)/;
var R_ANONYMOUS_FN_VAR_NAME = /var\s(\w*)\s*=\s*function/;
var R_ANONYMOUS_FN_PROPERTY_NAME = /([\w\.]+)(?=.*[:=].*function)/;
var R_PARAM_ANNOTATION = /@param/m;
var R_NEXT_TYPE_NAME_DESCRIPTION = /\{(\w*)\}\s+(\w*)\s*([^@]*)/m;
var R_PARAM_DESCRIPTION_ARTIFACTS = /\n\s*\*|\s*\*\/|\s*$|\/$/gm;
var R_FN_DESCRIPTION = /\/\*+[\n\s]*\*+\s+([^@]*)(?=\n.*@)/m;


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
 * @param {string} description The raw param description string that was parse
 * from a JSDoc block.
 * @return {string} The formatted description string (no line leading
 * asterisks, newlines).
 */
function scrubDescriptionString (description) {
  return description.replace(R_PARAM_DESCRIPTION_ARTIFACTS, '');
}


/**
 * @param {string} fromBlock The JSDoc block to parse param data from.
 * @return {Array.<Param>}
 */
function parseParams (fromBlock) {
  var params = [];
  var volatileCopy = fromBlock;
  var match;
  while (parseNextParamAnnotation(volatileCopy)) {
    var startFrom = volatileCopy.indexOf(PARAM) + PARAM.length;
    volatileCopy = volatileCopy.slice(startFrom);

    var typeAndNamePair = volatileCopy.match(R_NEXT_TYPE_NAME_DESCRIPTION);
    var type = typeAndNamePair[1];
    var name = typeAndNamePair[2];
    var description = scrubDescriptionString(typeAndNamePair[3]);

    params.push({
      'type': type
      ,'name': name
      ,'description': description
    });
  }

  return params;
}


/**
 * @param {string} fromBlock The JSDoc block to description data from.
 * @return {string}
 */
function parseDescription (fromBlock) {
  var match = fromBlock.match(R_FN_DESCRIPTION);
  return match
    ? match[1]
    : '';
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
    var description = parseDescription(block);
    var startFrom = text.indexOf(block) + block.length;
    var slicedText = text.slice(startFrom);
    var functionName = parseFunctionName(slicedText);

    metadataList.push({
      'name': functionName
      ,'description': description
      ,'params': parseParams(block)
    });
  });

  return metadataList;
};

