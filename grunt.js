'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/*.js']
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        evil: true,
        laxcomma: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        laxbreak: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');
  grunt.registerTask('doc', function () {
    var docBlock = require('./lib/block-doc');
    docBlock.document(['./lib/block-doc'], './doc');
  });

};
