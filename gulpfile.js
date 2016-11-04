/**
*
* The packages we are using
* Not using gulp-load-plugins as it is nice to see whats here.
*
**/
var gulp         = require('gulp');
    sass         = require('gulp-sass');
    browserSync  = require('browser-sync');
    jshint       = require('gulp-jshint');
    prefix       = require('gulp-autoprefixer');
    plumber      = require('gulp-plumber');
    uglify       = require('gulp-uglify');
    rename       = require("gulp-rename");
    imagemin     = require("gulp-imagemin");
    pngquant     = require('imagemin-pngquant');
    concat       = require('gulp-concat');
    notify       = require('gulp-notify');

/**
*
* Styles
* - Compile
* - Compress/Minify
* - Catch errors (gulp-plumber)
* - Autoprefixer
*
**/
gulp.task('sass', function() {
  gulp.src('scss/**/*.scss')
  .pipe(sass({
    outputStyle: 'compressed',
    includePaths: ['node_modules/susy/sass']
  }).on('error', sass.logError))
  .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
  .pipe(plumber())
  .pipe(gulp.dest('css'));
});

/**
*
* BrowserSync.io
* - Watch CSS, JS & HTML for changes
* - View project at: localhost:3000
*
**/
gulp.task('browser-sync', function() {
  browserSync.init(['css/*.css', 'js/**/*.js', 'index.html'], {
    server: {
      baseDir: './'
    }
  });
});


/**
*
* Javascript
* - Uglify
*
**/
gulp.task('scripts', function() {
  gulp.src('js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(rename({
    dirname: "min",
    suffix: ".min",
  }))
  .pipe(gulp.dest('js'))
});

/**
*
* Images
* - Compress them!
*
**/
gulp.task('images', function () {
  return gulp.src('images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('images'));
});


/**
*
* Default task
* - Runs sass, browser-sync, scripts and image tasks
* - Watchs for file changes for images, scripts and sass/css
*
**/
gulp.task('default', ['sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('images/*', ['images']);
});
