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

  ,'parse-function-description': function (test) {
    var text = blockDoc.loader.load('./test/fixtures/sum-named.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].description, 'A function that adds two numbers.',
        'Parsed the description.');
    test.done();
  }

  ,'parse-multi-line-function-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/multi-line-function-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].description,
        'Hi. I am a multiline function description. Have a nice day!',
        'Parsed the description.');
    test.done();
  }

  ,'parse-param-names': function (test) {
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

  ,'parse-multiline-method-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/multi-line-param-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].params.length, 1,
        'Parsed the list of @params');
    test.equals(meta[0].params[0].type, 'null',
        'Parsed the parameter type.');
    test.equals(meta[0].params[0].name, 'nothing',
        'Parsed the parameter name.');
    test.equals(meta[0].params[0].description,
        'This is nothing.  There\'s no good reason to pass a value here.',
        'Parsed the parameter description.');

    test.done();
  }

  ,'parse-return-no-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/return-no-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].return.type, 'number',
        'Parsed the return type.');
    test.equals(meta[0].return.description, '',
        'Parsed the return description.');

    test.done();
  }

  ,'parse-return-with-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/return-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].return.type, 'number',
        'Parsed the return type.');
    test.equals(meta[0].return.description,
        'The sum of num1 and num2.',
        'Parsed the return description.');

    test.done();
  }

  ,'parse-return-with-multi-line-description': function (test) {
    var text = blockDoc.loader.load(
        './test/fixtures/return-multi-line-description.js');
    var meta = blockDoc.parser.parseMetadataList(text);

    test.equals(meta[0].return.type, 'null',
        'Parsed the return type.');
    test.equals(meta[0].return.description,
        'This method returns null. How very exciting!',
        'Parsed the return description.');

    test.done();
  }
};
