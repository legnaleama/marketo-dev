// gulp - compiles SASS / optimizes img / watches for changes .html, .php, .js
// gulp produce - compress CSS / moves files de production folders

var gulp        = require('gulp'),
  	sass        = require('gulp-ruby-sass'),
	  browserSync = require('browser-sync'),
		     reload = browserSync.reload,
   autoprefixer = require('gulp-autoprefixer');
        timerev = require('gulp-rev');
        replace = require('gulp-replace');
        plumber = require('gulp-plumber');
           bust = require('gulp-buster');
            rev = require('gulp-rev-append');
//         uglify = require('gulp-uglify');
         rename = require('gulp-rename');


var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];


//build datestamp for cache busting
var getStamp = function() {
  var myDate = new Date();
  var myYear = myDate.getFullYear().toString();
  var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
  var myDay = ('0' + myDate.getDate()).slice(-2);
  var mySeconds = myDate.getSeconds().toString();
  var myFullDate = myYear + myMonth + myDay + mySeconds;
  return myFullDate;
};


// function errorLog(error) {
// 	console.error.bind(error);
// 	this.emit('end');
// }


// New Sass syntax compiler for gulp-ruby-sass
gulp.task('sassy', function() {
  return sass('./sass/', {
      compass: true,
      lineNumbers: true,
      style: 'expanded',
      'sourcemap=none': true // Bug fixing for deprecated sourcemaps on SASS 3.4
    })
    .pipe(plumber())

    //.on('error', errorLog)
    // .pipe(autoprefixer('3 last versions', {browsers: AUTOPREFIXER_BROWSERS}))
    // .pipe(bust())
    .pipe(gulp.dest('./css/'));
});
// End new syntax


// Cache busting
// Adds query trail to file url
gulp.task('rev', function() {
  gulp.src('*.html')
    .pipe(rev())
    .pipe(gulp.dest('./'));
});


// Server Task
// Start a server with Live Reload
gulp.task('serve', ['sassy'], function () {
  browserSync({
    // notify: false,
    // Customize the BrowserSync console logging prefix
    // logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    // server: ['.tmp', './']

    proxy: 'http://localhost:8888/'

  });

  gulp.watch(['sass/**/*.scss'], ['sassy','rev']);
  gulp.watch(['css/*.css'], reload);
  // gulp.watch(['./*.html'], reload);
  // gulp.watch(['./*.php'], reload);
  // gulp.watch(['js/**/*.js'], [reload]);
});

// Time Stamp
// Adds time stamp for cache revision
gulp.task('timerev', function () {
    gulp.src('*.php')
        .pipe(timerev({
          'fileTypes': ['css']
        }))
        .pipe(gulp.dest('./guat.php'));
});

// Cache Busting
// Adds timeStamp to files
gulp.task('cachebust', function() {
  return gulp.src('*.php')
    .pipe(replace('./css/dev/style.css?' + getStamp()))
    .pipe(gulp.dest('./cache/'))
});


// // Watch Task
// // Watch SCSS
// gulp.task('watch-style', function() {
// 	gulp.watch('sass/**/*.scss', ['sassy']);
// });

// To Production
// Move CSS to Production
gulp.task('build-css', function() {
  return sass('./sass/', {
    compass: true,
    lineNumbers: false,
    style: 'compressed',
    'sourcemap=none': true // Bug fixing for deprecated sourcemaps on SASS 3.4
    })
  .pipe(rename({
        suffix: ".min",
        extname: ".css"
      }))
  .pipe(gulp.dest('./css/'));
});


// To Production
// Minify JS and move to Production
gulp.task('build-js', function() {
  gulp.src('./js/')
    .pipe(uglify())
    .pipe(rename({
        suffix: ".min",
        extname: ".js"
      }))
    .pipe(gulp.dest('./js/'));
});

// To Production
// Move fonts to fonts folder
//gulp.task('build-fonts', function(){
//  gulp.src('fonts/fontello/font/*')
//  .pipe(gulp.dest('../../../fonts'));
//});

gulp.task('default', ['serve']);

gulp.task('build', ['build-img', 'build-css', 'build-js']);
