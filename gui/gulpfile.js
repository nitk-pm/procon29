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
	gulp.src(['./src/index.html'])
		.pipe(gulp.dest('./dist'))
);

gulp.task('renderer', () =>
	webpackStream(webpackConfig, webpack)
		.pipe(gulp.dest('./dist'))
);

gulp.task('ts-main', () => {
	var proj = ts.createProject('./tsconfig.json');
	return gulp.src([
		'./src/main.ts',
		'!./node_modules/**',
	])
	.pipe(proj())
	.js
	.pipe(gulp.dest('./dist'));
});

gulp.task('watch-ts-main', () =>
	gulp.watch('./src/main.ts', ['ts-main'])
);

gulp.task('watch-renderer', () =>
	gulp.watch('./src/*.{ts, tsx}', ['bundle'])
);

gulp.task('watch-html', () =>
	gulp.watch('./src/*.html', ['html'])
);

gulp.task('watch', ['watch-ts', 'watch-html', 'watch-renderer']);

gulp.task('default', ['ts-main', 'html', 'renderer']);
