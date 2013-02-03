'use strict';

var wrench = require('wrench');
var util = require('util');

var GENERATED_ASSET_PATH = 'asset/';

/**
 * @param {string} indexHtml The generated index.html contents.
 * @param {string} assetPath The path that the static asset files (CSS,
 * JavaScript) should be copied from.
 * @param {string} exportPath The path to export the static site files to.
 * @return {Boolean} Whether or not the export succeeded.
 */
exports.exportSite = function (indexHtml, assetPath, exportPath) {
  var exportedAssetPath = exportPath + GENERATED_ASSET_PATH;
  wrench.mkdirSyncRecursive(exportedAssetPath);
  wrench.copyDirSyncRecursive(assetPath, exportedAssetPath);

  return true;
};
