const gulp          = require('gulp');
const webpackStream = require('webpack-stream');
const webpack       = require('webpack');
const sass          = require('gulp-sass');


gulp.task('html', () =>
	gulp.src(['./src/html/*.html'])
		.pipe(gulp.dest('./dist'))
);

gulp.task('scss', () =>
	gulp
		.src(['./src/stylesheets/*.scss'])
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(gulp.dest('./dist'))
);

gulp.task('renderer', () => {
		const webpackConfig = require('./webpack-renderer.config.js');
		return webpackStream(webpackConfig, webpack)
			.pipe(gulp.dest('./dist'));
	}
);

gulp.task('main', () => {
	const webpackConfig = require('./webpack-main.config.js');
	return webpackStream(webpackConfig, webpack)
		.pipe(gulp.dest('./dist'))
});

gulp.task('icons', () =>
	gulp
		.src(['./icons/material-design-icons/*.svg'])
		.pipe(gulp.dest('./dist/icons/material-design-icons'))
);

gulp.task('default', ['main', 'html', 'scss', 'renderer', 'icons']);
