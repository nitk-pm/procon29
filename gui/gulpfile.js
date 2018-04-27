var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var gulp_typings = require('gulp-typings');
var gulp_elm = require('gulp-elm');

gulp.task('elm-init', gulp_elm.init);

gulp.task('elm', ['elm-init'], () =>
	gulp.src('src/*.elm')
		.pipe(gulp_elm())
		.pipe(gulp.dest('./app'))
);

gulp.task('html', () =>
	gulp.src(['./src/index.html'])
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
	.pipe(concat('index.js'))
	.pipe(gulp.dest('./app'));
});

gulp.task('watch-ts', () =>
	gulp.watch('./src/*.ts', ['typescript'])
);

gulp.task('watch-html', () =>
	gulp.watch('./src/*.html', ['html'])
);

gulp.task('watch-elm', () =>
	gulp.watch('./src/*.elm', ['elm'])
);

gulp.task('watch', ['watch-ts', 'watch-html', 'watch-elm']);

gulp.task('default', ['elm', 'typescript', 'html']);
