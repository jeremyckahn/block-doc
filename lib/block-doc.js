/*
 * block-doc
 * https://github.com/jeremyckahn/block-doc
 *
 * Copyright (c) 2013 Jeremy Kahn
 * Distributed under the MIT license.
 */
'use strict';

exports.loader = require('./block-doc.loader');
exports.parser = require('./block-doc.parser');
exports.htmlGenerator = require('./block-doc.html-generator');
exports.exporter = require('./block-doc.exporter');

/**
 * Generate a static documentation page.
 * @param {string|Array} files Filename or list of JavaScript filenames to
 * generate site for.
 * @param {string} destination The path of where to write the site files.
 * @param {string=} opt_tmplDir The directory that contains the
 * Handlebars template to use for the page.
 * @param {string=} opt_assetDir The directory that contains the asset file
 * (JavaScript, CSS, images) to copy to the destination directory.
 */
exports.document = function (files, destination, opt_tmplDir, opt_assetDir) {

};
