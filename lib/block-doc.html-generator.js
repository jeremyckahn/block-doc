'use strict';

var fs = require('fs');
var Mustache = require('mustache');

// CONSTANTS
//

var R_TMPL_PAGE_NAME = 'page.mustache';

/**
 * Generates an HTML page out of JSDoc metadata.
 * @param {Object} meta JSDoc metadata.
 * @param {string} templatePath Path to a template directory.
 * @return {string}
 */
exports.generate = function (meta, templatePath) {
  // Ensure there is a trailing slash
  if (!templatePath.match(/\/$/)) {
    templatePath += '/';
  }

  var pageTmpl = fs.readFileSync(templatePath + R_TMPL_PAGE_NAME).toString();

  return pageTmpl;
};
