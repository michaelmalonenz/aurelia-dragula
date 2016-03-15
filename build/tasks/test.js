var gulp = require('gulp');
var karma = require('karma');
var path = require('path');

var argv = require('yargs')
    .default('t', '*.js')
    .alias('t', 'tests')
    .describe('t', 'A file or file pattern of the test files to run, relative to the test/unit dir')
    .help('?')
    .alias('?', 'help')
    .argv;


/**
 * Add the files to test, always beginning with the source files!
 */
var filesToLoad = ['test/unit/initialize.js', 'src/**/*.js', 'test/unit/lib/*.js'];
filesToLoad.push(path.join('test/unit/**', argv.t));

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    var server = new karma.Server({
        configFile: __dirname + '/../../karma.conf.js',
        jspm: {
            loadFiles: filesToLoad,
            paths: {
                '*':'*.js'
            }
        },
        singleRun: true
    }, function(e) {
        done();
    });
    server.start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    var server = new karma.Server({
        configFile: __dirname + '/../../karma.conf.js',
        jspm: {
            loadFiles: filesToLoad,
            paths: {
                '*':'*.js'
            }
        }
    }, function(e) {
        done();
    });
    server.start();
});

/**
 * Run test once with code coverage and exit
 */
gulp.task('cover', function(done) {
  new karma.Server({
    configFile: __dirname + '/../../karma.conf.js',
    loadFiles: filesToLoad,
    singleRun: true,
    reporters: ['coverage'],
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel', 'coverage']
    },
    coverageReporter: {
      includeAllSources: true,
      instrumenters: {
        isparta: require('isparta')
      },
      instrumenter: {
        'src/**/*.js': 'isparta'
      },
      reporters: [
        { type: 'html', dir: 'coverage' },
        { type: 'text' }
      ]
    }
  }, done).start();
});