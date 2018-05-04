const gulp          = require('gulp');
const ts            = require('gulp-typescript');
const webpackStream = require('webpack-stream');
const webpack       = require('webpack');

const webpackConfig = require('./webpack.config.js');

gulp.task('start', () => {
	electron.start();

	gulp.watch(['./*.{html, js, css}'], electron.reload);
	gulp.watch(['./dist/main.js'], electron.restart);
});

gulp.task('html', () =>
	gulp.src(['./src/html/*.html'])
		.pipe(gulp.dest('./dist'))
);

gulp.task('css', () =>
	gulp.src(['./src/stylesheets/*.css'])
		.pipe(gulp.dest('./dist'))
);

gulp.task('renderer', () =>
	webpackStream(webpackConfig, webpack)
		.pipe(gulp.dest('./dist'))
);

gulp.task('ts-main', () => {
	var proj = ts.createProject('./tsconfig.json');
	return gulp.src([
		'./src/electron/*.ts',
		'!./node_modules/**',
	])
	.pipe(proj())
	.js
	.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['ts-main', 'html', 'css', 'renderer']);
