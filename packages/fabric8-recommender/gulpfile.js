
var gulp = require('gulp'),
  argv = require('yargs').argv;
  autoprefixer = require('autoprefixer'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] }),
  changed = require('gulp-changed'),
  cssmin = require('gulp-cssmin'),
  del = require('del'),
  exec = require('child_process').exec,
  lessCompiler = require('gulp-less'),
  ngc = require('gulp-ngc'),
  path = require('path'),
  postcss = require('postcss'),
  replace = require('gulp-string-replace'),
  runSequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  stylus = require('stylus');

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

function transpileLESS(src) {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(lessCompiler({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(cssmin().on('error', function(err) {
      console.log(err);
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/src/'));
}

function minifyCSS(file) {
  try {
    var minifiedFile = stylus.render(file);
    minifiedFile = postcss([autoprefixer]).process(minifiedFile).css;
    minifiedFile = csso.minify(minifiedFile).css;
    return minifiedFile;
  } catch (err) {
    console.log(err);
  }
}
/**
 * TASKS
 */

// stylelint
gulp.task('lint-less', function lintLessTask() {
  const gulpStylelint = require ('gulp-stylelint');

  return gulp
  .src('src/**/*.less')
  .pipe(gulpStylelint({
    failAfterError: true,
    reporters: [
    {formatter: 'string', console: true}
    ]
  }));
});

// require transpile to finish before the build starts the post-transpile task
gulp.task('post-transpile', ['transpile'], function () {
  return gulp.src(['dist/src/app/**/*.js'])
    .pipe(replace(/templateUrl:\s/g, "template: require("))
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/\.html'/g, ".html')"))
    .pipe(replace(/styleUrls: \[/g, "styles: [require("))
    .pipe(replace(/\.less']/g, ".css').toString()]"))
    .pipe(gulp.dest(function (file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the less-file was
    }));
});

// Less compilation - requires linting to complete before it will start
gulp.task('transpile-less', ['lint-less'], function () {
  return transpileLESS(appSrc + '/**/*.less');
});

// Put the LESS files back to normal
gulp.task('build-library',
  [
    'lint-less',
    'transpile-less',
    'transpile',
    'post-transpile',
    'copy-css',
    'copy-html',
    'copy-static-assets'
  ]);

// require transpile-less to finish before starting the transpile process
gulp.task('transpile', ['transpile-less'], function () {
  return ngc('tsconfig.json')
});

// require transpile to finish before copying the css
gulp.task('copy-css', ['transpile'], function () {
  return copyToDist([
    'src/**/*.css'
  ]);
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

gulp.task('copy-images', function () {
  return copyToDist([
    'src/**/*.svg',
    'src/**/*.png',
    'src/**/*.jpg',
    'src/**/*.jpeg',
    'src/**/*.gif'
  ]);
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
  gulp.watch([appSrc + '/app/**/*.less'], ['transpile-less']).on('change', function (e) {
    console.log(e.path + ' has been changed. Updating.');
    transpileLESS(e.path);
    updateWatchDist();
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (e) {
    console.log(e.path + ' has been changed. Updating.');
    copyToDist(e.path);
    updateWatchDist();
  });
});
