/*
 * grunt-autoindex
 * https://github.com/Matt/grunt-autoindex
 *
 * Copyright (c) 2013 mattdesl
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

  	dir: {
  		out: 'tmp'
  	},

	// Configuration to be run (and then tested).
	autoindex: {
		umd: {
			options: {

				// Optional banner; defaults to a date-stamped message.
				//   banner: "/** Test */",

				// List of files to not parse for our "core classes"
				// The file being generated is, of course, already ignored. 
				// file_ignores: ['myutil.js'],
				
				// Options for our dependency modules...
				modules: {

					//The module name, then its options
					'klasse': {
						//If a string is given, we export the entire
						//module by the given name. Result:
						//	Class: require('klasse')
						standalone: 'Class'

						//If standalone is falsy, we can ignore individual
						//exports like this:
						//  ignores: ['myfunc']
					},

					//If we specify as null, this dependency will be ignored.
					'minivec': null,
					'fs-walk': null
				},

				// Optional list of dependencies. Leave undefined
				// to use the package.json dependencies.
				//   dependencies: ['']
			},
			dest: '<%= dir.out %>/test/index.js',
			src: 'tmp/'
		}
	}

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
};
