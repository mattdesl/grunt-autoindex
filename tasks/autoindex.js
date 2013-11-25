/*
 * grunt-autoindex
 * https://github.com/Matt/grunt-autoindex
 *
 * Copyright (c) 2013 mattdesl
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var walk = require('fs-walk');
var path = require('path');
var DEFAULT_BANNER = "/** Auto-generated index file, created on <%= grunt.template.today('yyyy-mm-dd') %> */"
				
var buildIndex = function(grunt, outFile, src, dependencies, banner, opts, fileIgnores, requireIgnores) {
	grunt.log.writeln("Writing "+outFile);

	fileIgnores = fileIgnores || [];
	requireIgnores = requireIgnores || [];

	var text = banner.trim() + "\n";

	text += "module.exports = {\n";

	var UMD_DEPS = dependencies;

	var baseOutName = path.basename(outFile, '.js');

	//TODO: support deep source folder.

	var reqs = [{comment: 'core classes'}];
	walk.walkSync(src, function(basedir, filename, stat) {
		if (stat.isDirectory())
			return;
		if ( filename === "index.js" )
			return;

		if (path.extname(filename) in require.extensions) {
			var fullname = path.join(basedir, filename);

			if (fullname === outFile || fileIgnores.indexOf(fullname) !== -1)
				return;

			var reqName = fullname.split(path.sep);
			reqName.shift(); //remove src folder

			//re-join paths.. maybe better way of doing this in node
			var reqPath = './' + path.join.apply(this, reqName);
			var className = path.basename(reqPath, path.extname(reqPath));
			if (requireIgnores.indexOf(className) === -1)
				reqs.push({name: className, path: reqPath});
		}
	});

	for (var i=0; i<UMD_DEPS.length; i++) {
		var depModule = UMD_DEPS[i];

		var dep = require(depModule);
		var standalone = null;
		var ignores = [];
		opts = opts || {};

		if (depModule in opts) {
			//if null is specified for this module
			if (!opts[depModule])
				continue;

			standalone = opts[depModule].standalone;
			ignores = opts[depModule].ignores || [];
		}

		reqs.push({comment:depModule+' dependencies'});


		if (standalone) {
			reqs.push({path: depModule, name: standalone});
		} else {
			//Not a standalone module, so export everything inside it..
			//except for any ignores
			for (var k in dep) {
				if (dep.hasOwnProperty(k) && ignores.indexOf(k) === -1) {
					reqs.push({path: depModule, name: k, prop: k });
				}
			}	
		}
	}

	var longest = 0;
	for (var i=0; i<reqs.length; i++) {
		if (reqs[i].comment) continue;
		longest = Math.max(longest, reqs[i].name.length);
	}

	for (var i=0; i<reqs.length; i++) {
		if (reqs[i].comment) {
			if (i!==0)
				text += '\n';
			text += '    //'+reqs[i].comment+'\n';
			continue;
		}
		var className = reqs[i].name;
		var reqPath = reqs[i].path;
		var tab = Array( Math.max(4, 4 + longest-className.length) ).join(' ');

		text += "    '" + className + "':"+tab+"require('"+reqPath+"')";
		if (reqs[i].prop)
			text += '.'+reqs[i].prop;

		if (i !== reqs.length-1)
			text += ',\n';
		else
			text += '\n';
	}
	text += "};";

	var file = grunt.template.process(outFile);
	fs.writeFileSync(file, text);
};

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('autoindex', 'Writes an index.js file, ideal for Browserify.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			banner: grunt.template.process(DEFAULT_BANNER),
			requires: {}
		});

		//Get the output index.js file
		var file = this.data.dest;
		//the source folder to look through
		var srcFolder = this.data.src;

		var deps = options.dependencies || Object.keys( grunt.file.readJSON('package.json').dependencies );
		console.log(deps)
		buildIndex(grunt, file, srcFolder, deps, options.banner, 
					options.modules, options.file_ignores, options.require_ignores);

	});

};
