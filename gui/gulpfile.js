var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var gulp_typings = require('gulp-typings');

gulp.task('build', () => {
	var proj = ts.createProject('./tsconfig.json');
	gulp.src([
		'./typings/index.d.ts',
		'./src/**/*.ts',
		'!./node_modules/**',
	])
	.pipe(proj())
	.js
	.pipe(concat('index.js'))
	.pipe(gulp.dest('./app'));

	gulp.src([
		'./src/index.html'
	])
	.pipe(gulp.dest('./app'));
});
