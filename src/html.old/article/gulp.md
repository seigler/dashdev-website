---
title: Gulp
description: Do you need Gulp? Can it be integrated with Metalsmith?
publish: 2016-03-02
---

Metalsmith has plugins for [CSS pre-processing with Sass](https://github.com/stevenschobert/metalsmith-sass), [image minification](https://github.com/ahmadnassri/metalsmith-imagemin), [file concatenation](https://github.com/aymericbeaumet/metalsmith-concat), [uglification](https://github.com/ksmithut/metalsmith-uglify) and more. The build code will be familiar to anyone with [Gulp](http://gulpjs.com/) experience.


## Do you still need Gulp?
Metalsmith is often enough for simpler workflows. However, Gulp has a more extensive range of plugins and permits complex build activities such as linting and [PostCSS](http://postcss.org/) processing with [auto-prefixer](https://github.com/postcss/autoprefixer).

Metalsmith can be used within any Gulp task, e.g.

	var
		gulp       = require('gulp'),
		metalsmith = require('metalsmith'),
		publish    = require('metalsmith-publish'),
		markdown   = require('metalsmith-markdown');

	// build HTML files using Metalsmith
	gulp.task('html', function() {

		var ms = metalsmith(dir.base)
			.clean(false)
			.source('src/html/')
			.destination('build')
			.use(publish())
			.use(markdown())
			.build(function(err) {
				if (err) throw err;
			});

	});

Further Gulp tasks can then be added. Note `.clean(false)` ensures Metalsmith never wipes the build folder when other tasks are active.

There are a number of Gulp/Metalsmith integration plugins although they are rarely necessary.
