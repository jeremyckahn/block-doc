/*
 * block-doc
 * https://github.com/jeremyckahn/block-doc
 *
 * Copyright (c) 2013 Jeremy Kahn
 * Distributed under the MIT license.
 */
'use strict';

var loader = exports.loader = require('./block-doc.loader');
var parser = exports.parser = require('./block-doc.parser');
var htmlGenerator = exports.htmlGenerator =
  require('./block-doc.html-generator');
var exporter = exports.exporter = require('./block-doc.exporter');

/**
 * Generate a static documentation page.
 * @param {string|Array} files Filename or list of JavaScript filenames to
 * generate site for.
 * @param {string} destination The path of where to write the site files.
 */
exports.document = function (files, destination) {
  if (files instanceof Array === false) {
    files = [files];
  }

  var source = '';
  files.forEach(function (file) {
    source += loader.load(file);
  });

  var meta = parser.parseMetadataList(source);
  var generatedHtml = htmlGenerator.generate('./template', meta);

  // TODO: The asset and export paths must not be hardcoded, they should be
  // configurable.
  exporter.exportSite('./doc', './template/asset', destination);
};
