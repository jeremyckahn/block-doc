'use strict';

var blockDoc = require('../lib/block-doc.js');

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

exports.loader = {
  'hello-world': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/hello-world.js');

    test.equal(typeof text, 'string',
        'Loaded file data is a string');
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
        'Parsed single method.');
    test.equals(meta[0].name, 'sum',
        'Parsed method name.');

    test.done();
  }

  ,'parse-anonymous-var-function': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/sum-anonymous-var.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 1,
        'Parsed single method.');
    test.equals(meta[0].name, 'sum',
        'Parsed method name.');

    test.done();
  }

  ,'parse-anonymous-property-function': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/sum-anonymous-in-object.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 1,
        'Parsed single method.');
    test.equals(meta[0].name, 'sum',
        'Parsed method name.');

    test.done();
  }

  ,'parse-prototype-function': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/sum-prototype.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 1,
        'Parsed single method.');
    test.equals(meta[0].name, 'Base.prototype.sum',
        'Parsed method name.');

    test.done();
  }

  ,'parse-multiple-mixed-function': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/mixed-function-formats.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta.length, 3,
        'Parsed multiple methods.');
    test.equals(meta[0].name, 'sum',
        'Parsed first method name.');
    test.equals(meta[1].name, 'subtract',
        'Parsed second method name.');
    test.equals(meta[2].name, 'multiply',
        'Parsed third method name.');

    test.done();
  }

  ,'parse-method-names': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/sum-named.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].params.length, 2,
        'Parsed the list of @params');
    test.equals(meta[0].params[0].type, 'number',
        'Parsed the first parameter type.');
    test.equals(meta[0].params[1].type, 'number',
        'Parsed the second parameter type.');
    test.equals(meta[0].params[0].name, 'num1',
        'Parsed the first parameter name.');
    test.equals(meta[0].params[1].name, 'num2',
        'Parsed the second parameter name.');
    test.equals(meta[0].params[0].description,
        'The first number to add.',
        'Parsed the first parameter description.');
    test.equals(meta[0].params[1].description,
        'The second number to add.',
        'Parsed the second parameter description.');

    test.done();
  }
};
