'use strict';

var fs = require('fs');
var Mustache = require('mustache');

// CONSTANTS
//

var R_TMPL_PAGE_NAME = 'page.mustache';

/**
 * Generates an HTML page out of JSDoc metadata.
 * @param {string} templatePath Path to a template directory.
 * @param {Object} meta JSDoc metadata.
 * @param {Object=} opt_config Configuration options for generated page.
 * @return {string}
 */
exports.generate = function (templatePath, meta, opt_config) {
  var config = opt_config || {};

  // Ensure there is a trailing slash
  if (!templatePath.match(/\/$/)) {
    templatePath += '/';
  }

  var pageTmpl = fs.readFileSync(templatePath + R_TMPL_PAGE_NAME).toString();

  return pageTmpl;
};
