
var gulp = require('gulp'),
  sassCompiler = require('gulp-sass'),
  runSequence = require('run-sequence'),
  del = require('del'),
  replace = require('gulp-string-replace'),
  sourcemaps = require('gulp-sourcemaps'),
  exec = require('child_process').exec,
  ngc = require('gulp-ngc'),
  changed = require('gulp-changed'),
  sass = require('./config/sass'),
  argv = require('yargs').argv;

var appSrc = 'src';
var libraryDist = 'dist';
var watchDist = 'dist-watch';

/**
 * FUNCTION LIBRARY
 */

function copyToDist(srcArr) {
  return gulp.src(srcArr)
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length); // save directly to dist
    }));
}

function updateWatchDist() {
  return gulp
    .src(libraryDist + '/**')
    .pipe(changed(watchDist))
    .pipe(gulp.dest(watchDist));
}

function transpileSASS(src, debug) {
  let opts = {
    outputStyle: 'compressed',
    includePaths: sass.modules.map(val => {
      return val.sassPath;
    })
  };

  if (debug) {
    opts.outputStyle = 'expanded';
    opts.sourceComments = true;
    console.log('Compiling', src,'in debug mode using SASS options:', opts );
  }
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(sassCompiler(opts).on('error', sassCompiler.logError)) // this will prevent our future watch-task from crashing on sass-errors
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length); // save directly to dist
    }));
}

/**
 * TASKS
 */

gulp.task('post-transpile', ['transpile'], function () {
  return gulp.src(['dist/src/app/**/*.js'])
    .pipe(replace(/templateUrl:\s/g, "template: require("))
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/styleUrls: \[/g, "styles: [require("))
    .pipe(replace(/\.scss']/g, ".css').toString()]"))
    .pipe(gulp.dest(function (file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

//Sass compilation and minifiction
gulp.task('transpile-sass', function () {
  if (argv['sass-src']) {
    return transpileSASS(argv['sass-src'], true);
  } else {
    return transpileSASS(appSrc + '/app/**/*.scss');
  }
});

// Put the SASS files back to normal
gulp.task('build-library',
  [
    'transpile',
    'post-transpile',
    'transpile-sass',
    'copy-html',
    'copy-static-assets'
  ]);

gulp.task('transpile', /*['pre-transpile'],*/ function () {
  return ngc('tsconfig.json')
});

gulp.task('copy-html', function () {
  return copyToDist([
    'src/**/*.html'
  ]);
});

gulp.task('copy-static-assets', function () {
  return gulp.src([
    'LICENSE',
    'README.adoc',
    'package.json',
  ])
    .pipe(gulp.dest(libraryDist));
});

gulp.task('copy-watch', ['post-transpile'], function () {
  return updateWatchDist();
});

gulp.task('copy-watch-all', ['build-library'], function () {
  return updateWatchDist();
});

gulp.task('watch', ['build-library', 'copy-watch-all'], function () {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['transpile', 'post-transpile', 'copy-watch']).on('change', function (e) {
    console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
  });
  gulp.watch([appSrc + '/app/**/*.scss']).on('change', function (e) {
    console.log(e.path + ' has been changed. Updating.');
    transpileSASS(e.path);
    updateWatchDist();
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (e) {
    console.log(e.path + ' has been changed. Updating.');
    copyToDist(e.path);
    updateWatchDist();
  });
});
