var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system'],
    callback
  );
});

gulp.task('build-system', function() {
  return gulp.src(paths.source)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(changed(paths.output, {extension: '.js'}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src'}))
    .pipe(gulp.dest(paths.output));
});