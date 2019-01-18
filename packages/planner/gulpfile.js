/*
 * Main build file for fabric8-planner.
 * ---
 * Each main task has parametric handlers to achieve different result.
 * Check out the sections for task variants & accepted task arguments.
 */

// Require primitives
var del = require('del'),
  path = require('path'),
  argv = require('yargs').argv,
  proc = require('child_process');
// Require gulp & its extension modules
var gulp = require('gulp'),
  ngc = require('gulp-ngc'),
  less = require('gulp-less'),
  util = require('gulp-util'),
  lesshint = require('gulp-lesshint'),
  srcmaps = require('gulp-sourcemaps'),
  replace = require('gulp-string-replace'),
  tslint = require('gulp-tslint');
// Requirements with special treatments
var KarmaServer = require('karma').Server,
  LessAutoprefix = require('less-plugin-autoprefix'),
  autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
// Not sure if var or const
var appSrc = 'src';
var distPath = 'dist';

/*
 * Utility functions
 */

// Global namespace to contain the reusable utility routines
let mach = {};

// Serialized typescript compile and post-compile steps
mach.transpileTS = function() {
  return gulp.series(
    function() {
      return ngc('tsconfig.json');
    },
    function() {
      // FIXME: why do we need that?
      // Replace templateURL/styleURL with require statements in js.
      return gulp
        .src(['dist/app/**/*.js'])
        .pipe(replace(/templateUrl:\s/g, 'template: require('))
        .pipe(replace(/\.html',{0,1}/g, ".html'),"))
        .pipe(replace(/styleUrls: \[/g, 'styles: [require('))
        .pipe(replace(/\.less']/g, ".css').toString()]"))
        .pipe(
          gulp.dest(function(file) {
            return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the less-file was
          }),
        );
    },
  )();
};

// Copy files to the distPath
mach.copyToDist = function(srcArr) {
  return gulp.src(srcArr).pipe(
    gulp.dest(function(file) {
      // Save directly to dist; @TODO: rethink the path evaluation strategy
      return distPath + file.base.slice(__dirname.length + 'src/'.length);
    }),
  );
};

//TSLint

mach.tslint = function(src) {
  return gulp
    .src(src)
    .pipe(
      tslint({
        formatter: 'verbose',
        configuration: 'tslint.json',
      }),
    )
    .pipe(tslint.report());
};

// Transpile given LESS source(s) to CSS, storing results to distPath.
mach.transpileLESS = function(src, debug) {
  return gulp
    .src(src)
    .pipe(
      lesshint({
        configPath: './.lesshintrc', // Options
      }),
    )
    .pipe(
      less({
        plugins: [autoprefix],
      }),
    )
    .pipe(lesshint.reporter()) // Leave empty to use the default, "stylish"
    .pipe(lesshint.failOnError()) // Use this to fail the task on lint errors
    .pipe(srcmaps.init())
    .pipe(less())
    .pipe(srcmaps.write())
    .pipe(
      gulp.dest(function(file) {
        return distPath + file.base.slice(__dirname.length + 'src/'.length);
      }),
    );
};

/*
 * Task declarations
 */

// Build
gulp.task('build', function(done) {
  // app (default)
  mach.tslint(appSrc + '/app/**/*.ts'); // Report all the linter errors
  mach.transpileTS(); // Transpile *.ts to *.js; _then_ post-process require statements to load templates
  mach.transpileLESS(appSrc + '/**/*.less'); // Transpile and minify less, storing results in distPath.
  mach.copyToDist(['src/**/*.html']); // Copy template html files to distPath
  gulp.src(['LICENSE', 'README.adoc', 'package.json']).pipe(gulp.dest(distPath)); // Copy static assets to distPath

  // image

  // tarball

  // validate

  // watch
  if (argv.watch) {
    gulp
      .watch([
        appSrc + '/app/**/*.ts',
        '!' + appSrc + '/app/**/*.spec.ts',
        appSrc + '/planner.module.ts',
      ])
      .on('change', function(e) {
        util.log(util.colors.cyan(e) + ' has been changed. Compiling TypeScript.');
        mach.transpileTS();
      });
    gulp.watch(appSrc + '/app/**/*.less').on('change', function(e) {
      util.log(util.colors.cyan(e) + ' has been changed. Compiling LESS.');
      mach.transpileLESS(e);
    });
    gulp.watch(appSrc + '/app/**/*.html').on('change', function(e) {
      util.log(util.colors.cyan(e) + ' has been changed. Compiling HTML.');
      mach.copyToDist(e);
    });
    util.log('Now run');
    util.log('');
    util.log(util.colors.red('    npm link', path.resolve(distPath), ' --production'));
    util.log('');
    util.log('in the npm module you want to link this one to');
  }
  done();
});

// Clean
gulp.task('clean', function(done) {
  // all (default): set flags to validate following conditional cleanups
  if (!argv.cache && !argv.config && !argv.dist && !argv.images && !argv.modules && !argv.temp) {
    // if none of the known sub-task parameters for `clean` was provided
    // i.e. only `gulp clean` was called, then set default --all flag ON
    argv.all = true;
  }

  if (argv.all) {
    // Exclusively set all subroutine parameters ON for `gulp clean --all`
    argv.cache = argv.config = argv.dist = argv.images = argv.modules = argv.temp = true;
  }

  // cache
  if (argv.cache) proc.exec('npm cache clean');

  // config
  // if (argv.config) { subroutine to clean config - not yet needed }

  // dist
  if (argv.dist) del([distPath]);

  // images
  if (argv.images) {
    // Get ID of the images having 'fabric8-planner' in its name
    proc.exec('sudo docker ps -aq --filter "name=fabric8-planner"', function(e, containerID) {
      if (e) {
        console.log(e);
        return;
      }

      // @TODO: wrap this in a try-catch block to avoid unexpected behavior
      proc.exec('sudo docker stop ' + containerID);
      proc.exec('sudo docker rm ' + containerID);

      // Container has been killed, safe to remove image(s) with 'fabric8-planner-*' as part of their ref
      proc.exec('sudo docker images -aq --filter "reference=fabric8-planner-*"', function(
        e,
        imageID,
      ) {
        if (e) {
          console.log(e);
          return;
        }

        // @TODO: wrap this in a try-catch block to avoid unexpected behavior
        proc.exec('sudo docker rmi ' + imageID);
      });
    });
  }

  // modules
  if (argv.modules) del(['node_modules']);

  // temp
  if (argv.temp) del(['tmp', 'coverage', 'typings', '.sass-cache']);

  done();
});

// // Release
// gulp.task('release', function (done) {
//   gulp.src(['.git/**/*']).pipe(gulp.dest('dist/.git'));
//   proc.exec('$(npm bin)/semantic-release', function(error, stdout) {
//     console.log("error: ", error);
//     console.log(stdout);
//   });

//   done();
// });

// Test
gulp.task('tests', function(done) {
  // unit
  if (argv.unit) {
    new KarmaServer(
      {
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
      },
      function(code) {
        process.exit(code);
      },
    ).start();
  }

  // func
  if (argv.func) {
    // subroutine to run functional tests
  }

  // smok
  if (argv.smok) {
    // subroutine to run smoke tests
  }

  done();
});
