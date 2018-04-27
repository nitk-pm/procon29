var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var gulp_typings = require('gulp-typings');
var electron = require('electron-connect').server.create({path: "./app"});

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

gulp.task('typescript', () => {
	var proj = ts.createProject('./tsconfig.json');
	return gulp.src([
		'./typings/index.d.ts',
		'./src/**/*.ts',
		'!./node_modules/**',
	])
	.pipe(proj())
	.js
	.pipe(concat('main.js'))
	.pipe(gulp.dest('./app'));
});

gulp.task('watch-ts', () =>
	gulp.watch('./src/*.ts', ['typescript'])
);

gulp.task('watch-html', () =>
	gulp.watch('./src/*.html', ['html'])
);


gulp.task('watch-package.json', () =>
	gulp.watch('./package.json', ['package.json'])
);

gulp.task('watch', ['watch-ts', 'watch-html', 'watch-package.json']);

gulp.task('default', ['typescript', 'html', 'package.json']);
