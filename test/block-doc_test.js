'use strict';

var fs = require('fs');
var $ = require('jquery');
var wrench = require('wrench');
var util = require('util');
var blockDoc = require('../lib/block-doc.js');

//  test helpers
//
var TMP_EXPORT_DIRECTORY = '/tmp/js-doc-block.generated/';

var helper = {

  'sumMeta': function () {
    var text = blockDoc.loader.load(
        './test/fixtures/all-annotations.js');
    return blockDoc.parser.parseMetadataList(text);
  }

  ,'exporterTeardown': function () {
    wrench.rmdirSyncRecursive(TMP_EXPORT_DIRECTORY);
  }
};


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/


// Do a little preemptive cleanup to prevent tests from dying spuriously.
try {
  wrench.rmdirSyncRecursive(TMP_EXPORT_DIRECTORY);
} catch (ex) {

}


exports.loader = {
  'hello-world': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/hello-world.js');

    test.equal(typeof text, 'string',
        'Loads file data is a string');
    test.equal(text, "'Hello, World!';",
        'Read the contents of hello-world.js correctly.');

    test.done();
  }

  ,'bad-input-file': function (test) {
    test.throws(
        function () {
          blockDoc.loader.load('./test/fixtures/invalid.js');
        },
        'PARSE_ERROR: ./test/fixtures/invalid.js',
        'Invalid JavaScript file threw an exception.');

    test.done();
  }
};


exports.parser = {
  'parse-named-function': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/sum-named.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 1,
        'Parses single method.');
    test.equals(meta[0].name, 'sum',
        'Parses method name.');

    test.done();
  }

  ,'parse-anonymous-var-function': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/sum-anonymous-var.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 1,
        'Parses single method.');
    test.equals(meta[0].name, 'sum',
        'Parses method name.');

    test.done();
  }

  ,'parse-anonymous-property-function': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/sum-anonymous-in-object.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 1,
        'Parses single method.');
    test.equals(meta[0].name, 'sum',
        'Parses method name.');

    test.done();
  }

  ,'parse-prototype-function': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/sum-prototype.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 1,
        'Parses single method.');
    test.equals(meta[0].name, 'Base.prototype.sum',
        'Parses method name.');

    test.done();
  }

  ,'parse-multiple-mixed-function': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/mixed-function-formats.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 3,
        'Parses multiple methods.');
    test.equals(meta[0].name, 'sum',
        'Parses first method name.');
    test.equals(meta[1].name, 'subtract',
        'Parses second method name.');
    test.equals(meta[2].name, 'multiply',
        'Parses third method name.');

    test.done();
  }

  ,'parse-function-description': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/sum-named.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].description, 'A function that adds two numbers.',
        'Parses the description.');
    test.done();
  }

  ,'parse-multi-line-function-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/multi-line-function-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].description,
        'Hi. I am a multiline function description. Have a nice day!',
        'Parses the description.');
    test.done();
  }

  ,'parse-params': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/sum-named.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].params.length, 2,
        'Parses the list of @params');
    test.equals(meta[0].params[0].type, 'number',
        'Parses the first parameter type.');
    test.equals(meta[0].params[1].type, 'number',
        'Parses the second parameter type.');
    test.equals(meta[0].params[0].name, 'num1',
        'Parses the first parameter name.');
    test.equals(meta[0].params[1].name, 'num2',
        'Parses the second parameter name.');
    test.equals(meta[0].params[0].description,
        'The first number to add.',
        'Parses the first parameter description.');
    test.equals(meta[0].params[1].description,
        'The second number to add.',
        'Parses the second parameter description.');

    test.done();
  }

  ,'parse-multiline-method-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/multi-line-param-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].params.length, 1,
        'Parses the list of @params');
    test.equals(meta[0].params[0].type, 'null',
        'Parses the parameter type.');
    test.equals(meta[0].params[0].name, 'nothing',
        'Parses the parameter name.');
    test.equals(meta[0].params[0].description,
        'This is nothing.  There\'s no good reason to pass a value here.',
        'Parses the parameter description.');

    test.done();
  }

  ,'parse-return-no-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/return-no-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0]['return'].type, 'number',
        'Parses the return type.');
    test.equals(meta[0]['return'].description, '',
        'Parses the return description.');

    test.done();
  }

  ,'parse-return-with-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/return-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0]['return'].type, 'number',
        'Parses the return type.');
    test.equals(meta[0]['return'].description,
        'The sum of num1 and num2.',
        'Parses the return description.');

    test.done();
  }

  ,'parse-return-with-multi-line-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/return-multi-line-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0]['return'].type, 'null',
        'Parses the return type.');
    test.equals(meta[0]['return'].description,
        'This method returns null. How very exciting!',
        'Parses the return description.');

    test.done();
  }

  ,'parse-block-with-all-annotations': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/all-annotations.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].params.length, 2,
        'Parses the list of @params');
    test.equals(meta[0].params[0].type, 'number',
        'Parses the first parameter type.');
    test.equals(meta[0].params[1].type, 'number',
        'Parses the second parameter type.');
    test.equals(meta[0].params[0].name, 'num1',
        'Parses the first parameter name.');
    test.equals(meta[0].params[1].name, 'num2',
        'Parses the second parameter name.');
    test.equals(meta[0].params[0].description,
        'The first number to add.',
        'Parses the first parameter description.');
    test.equals(meta[0].params[1].description,
        'The second number to add.',
        'Parses the second parameter description.');
    test.equals(meta[0]['return'].type, 'number',
        'Parses the return type.');
    test.equals(meta[0]['return'].description,
        'The sum of num1 and num2.',
        'Parses the return description.');

    test.done();
  }
};


exports.htmlGenerator = {
  'generate-blank-page': function (test) {
    var generatedHtml = blockDoc.htmlGenerator.generate('./template', {});

    test.equals(generatedHtml.match(/<!DOCTYPE html>/g).length, 1,
        'Generates an HTML page.');

    test.done();
  }

  ,'generate-custom-title': function (test) {
    var generatedHtml = blockDoc.htmlGenerator.generate('./template', {}, {
      'title': 'foobar'
    });

    test.equals(generatedHtml.match(/<title>foobar<\/title>/g).length, 1,
        'Generates a custom title.');

    test.done();
  }

  ,'generate-default-title': function (test) {
    var generatedHtml = blockDoc.htmlGenerator.generate('./template', {});

    test.equals(
        generatedHtml.match(/<title>Generated by JSBlockDoc<\/title>/g).length,
        1, 'Generates the default title.');

    test.done();
  }

  ,'generate-custom-top-level-header': function (test) {
    var generatedHtml = blockDoc.htmlGenerator.generate('./template', {}, {
      'name': 'foobar'
    });

    test.equals(generatedHtml.match(/<h1>foobar<\/h1>/g).length, 1,
        'Generates a custom top-level header.');
    test.equals(generatedHtml.match(/<h1>/g).length, 1,
        'Only renders one <h1>.');

    test.done();
  }

  ,'generate-default-top-level-header': function (test) {
    var generatedHtml = blockDoc.htmlGenerator.generate('./template', {});

    test.equals(generatedHtml.match(/<h1>API Reference<\/h1>/g).length, 1,
        'Generates the default top-level header.');
    test.equals(generatedHtml.match(/<h1>/g).length, 1,
        'Only renders one <h1>.');

    test.done();
  }

  ,'generate-method-header': function (test) {
    var generatedHtml =
        blockDoc.htmlGenerator.generate('./template', helper.sumMeta());
    var $dom = $(generatedHtml);

    test.equals($dom.find('.api h2').text(), 'sum',
        'Renders API header for function name.');

    test.done();
  }

  ,'generate-method-params': function (test) {
    var generatedHtml =
        blockDoc.htmlGenerator.generate('./template', helper.sumMeta());
    var $dom = $(generatedHtml);

    test.equals($dom.find('ul.params > li').length, 2,
        'Renders parameter containers.');
    test.equals($dom.find('ul.params > li:eq(0) .name').text(), 'num1',
        'Renders first parameter name.');
    test.equals($dom.find('ul.params > li:eq(1) .name').text(), 'num2',
        'Renders second parameter name.');
    test.equals($dom.find('ul.params > li:eq(0) .description').text(),
        'The first number to add.',
        'Renders first parameter description.');
    test.equals($dom.find('ul.params > li:eq(1) .description').text(),
        'The second number to add.',
        'Renders second parameter description.');
    test.equals($dom.find('ul.params > li:eq(0) .type').text(), 'number',
        'Renders first parameter type.');
    test.equals($dom.find('ul.params > li:eq(1) .type').text(), 'number',
        'Renders second parameter type.');

    test.done();
  }

  ,'generate-return-meta': function (test) {
    var generatedHtml =
        blockDoc.htmlGenerator.generate('./template', helper.sumMeta());
    var $dom = $(generatedHtml);

    test.equals($dom.find('li.api:eq(0) .return').length, 1,
        'Renders return container.');
    test.equals($dom.find('li.api:eq(0) .return .type').text(), 'number',
        'Renders return type.');
    test.equals($dom.find('li.api:eq(0) .return .description').text(),
        'The sum of num1 and num2.',
        'Renders return description.');

    test.done();
  }
};


exports.exporter = {

  'copy-asset-directories': function (test) {
    blockDoc.exporter.exportSite('', './template/asset/',
        TMP_EXPORT_DIRECTORY);

    var rootExists = fs.existsSync(TMP_EXPORT_DIRECTORY);
    var assetsExist = fs.existsSync(TMP_EXPORT_DIRECTORY + 'asset');
    var cssDirExists = fs.existsSync(TMP_EXPORT_DIRECTORY + 'asset/css');
    var jsDirExists = fs.existsSync(TMP_EXPORT_DIRECTORY + 'asset/js');

    test.ok(rootExists,
        'Exported root directory exists.');
    test.ok(assetsExist,
        'Exported asset directory exists.');
    test.ok(cssDirExists,
        'Exported CSS directory exists.');
    test.ok(jsDirExists,
        'Exported JavaScript directory exists.');

    helper.exporterTeardown();
    test.done();
  }

  ,'generates-index-file': function (test) {
    var generatedHtml =
        blockDoc.htmlGenerator.generate('./template', helper.sumMeta());
    blockDoc.exporter.exportSite(generatedHtml, './template/asset/',
        TMP_EXPORT_DIRECTORY);

    var indexExists = fs.existsSync(TMP_EXPORT_DIRECTORY + 'index.html');

    test.ok(indexExists,
        'Exported index.html file exists.');

    helper.exporterTeardown();
    test.done();
  }
};
