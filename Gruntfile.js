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
				
				modules: {
					'path': {
						standalone: 'path'
					}
				},

				// Optional list of dependencies. Leave undefined
				// to use the package.json dependencies.
				  dependencies: []
			},
			dest: '<%= dir.out %>/index-umd.js',
			src: '<%= dir.out %>'
		}
	}

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
};
