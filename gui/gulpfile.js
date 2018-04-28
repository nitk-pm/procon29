var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var gulp_typings = require('gulp-typings');
var electron = require('electron-connect').server.create({path: "./app"});
var browserify = require('browserify')
var source = require('vinyl-source-stream');

gulp.task('start', () => {
	electron.start();

	gulp.watch(['./app/main.js'], electron.restart);
	gulp.watch(['./*.{html, js, css}'], electron.reload);
});

gulp.task('html', () =>
	gulp.src(['./src/index.html'])
		.pipe(gulp.dest('./app'))
);

gulp.task('package.json', () =>
	gulp.src(['./package.json'])
		.pipe(gulp.dest('./app'))
);

gulp.task('ts-main', () => {
	var proj = ts.createProject('./tsconfig.json');
	return gulp.src([
		'./src/main.ts',
		'!./node_modules/**',
	])
	.pipe(proj())
	.js
	.pipe(gulp.dest('./app'));
});

gulp.task('ts-renderer', () => {
	var proj = ts.createProject('./tsconfig.json');
	return gulp.src([
		'!./src/main.ts',
		'./src/**/*.ts',
		'./src/**/*.tsx',
		'!./node_modules/**',
	])
	.pipe(proj())
	.js
	.pipe(gulp.dest('./app'));
});

gulp.task('bundle', ['ts-renderer'], () => {
	var b = browserify('./app/index.js');
	return b.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./app'));
});

gulp.task('watch-ts-main', () =>
	gulp.watch('./src/main.ts', ['ts-main'])
);

gulp.task('watch-ts-renderer', () =>
	gulp.watch('./src/*.ts', ['bundle'])
);

gulp.task('watch-html', () =>
	gulp.watch('./src/*.html', ['html'])
);


gulp.task('watch-package.json', () =>
	gulp.watch('./package.json', ['package.json'])
);

gulp.task('watch', ['watch-ts', 'watch-html', 'watch-package.json']);

gulp.task('default', ['ts-main', 'html', 'package.json', 'bundle']);
