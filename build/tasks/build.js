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
var through2 = require('through2');
var tools = require('aurelia-tools');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var htmlmin = require('gulp-htmlmin');

var jsName = paths.packageName + '.js';

gulp.task('build-system', function() {
  return gulp.src(paths.source)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(changed(paths.output, {extension: '.js'}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src'}))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'build-index',
    ['build-es2015-temp', 'build-es2015', 'build-commonjs', 'build-amd', 'build-system'],
    'build-html',
    'copy-css',
    callback
  );
});


gulp.task('build-index', function(){
  var importsToAdd = [];

  return gulp.src([
    paths.root + '*.js',
    paths.root + '**/*.js',
   '!' + paths.root + 'index.js'])
    .pipe(through2.obj(function(file, enc, callback) {
      file.contents = new Buffer(tools.extractImports(file.contents.toString("utf8"), importsToAdd));
      this.push(file);
      return callback();
    }))
    .pipe(concat(jsName))
    .pipe(insert.transform(function(contents) {
      return tools.createImportBlock(importsToAdd) + contents;
    }))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-es2015-temp', function () {
    return gulp.src(paths.output + jsName)
      .pipe(to5(assign({}, compilerOptions.commonjs())))
      .pipe(gulp.dest(paths.output + 'temp'));
});

gulp.task('build-es2015', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.es2015())))
    .pipe(gulp.dest(paths.output + 'es2015'));
});

gulp.task('build-commonjs', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.commonjs())))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.amd())))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('copy-css', function() {
  [ 'es2015', 'commonjs', 'amd', 'system'].forEach(function(dir) {
    return gulp.src(paths.style)
      .pipe(gulp.dest(paths.output + dir));
  });
});

gulp.task('build-html', function() {
  [ 'es2015', 'commonjs', 'amd', 'system'].forEach(function(dir) {
    return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.output + dir));
  });
});
