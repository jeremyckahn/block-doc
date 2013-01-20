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
          blockDoc.loader.load('./test/fixtures/invalid.js')
        },
        'PARSE_ERROR: ./test/fixtures/invalid.js',
        'Invalid JavaScript file threw an exception.');

    test.done();
  }
};
