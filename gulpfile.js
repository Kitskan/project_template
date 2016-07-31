'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var gcmq = require('gulp-group-css-media-queries');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var imgmin = require('gulp-imagemin');
var del = require('del');
var flatten = require('gulp-flatten');
var browserSync = require('browser-sync').create();
var svgSprite = require('gulp-svg-sprite');

//Sprite task
gulp.task('svg:start', function () {
  var config = {
    shape: {
      dimension: {			// Set maximum dimensions
        maxWidth: 32,
        maxHeight: 32
      },
      spacing: {			// Add padding
        padding: 10
      }
    },
    mode: {
      view: {			// Activate the «view» mode
        bust: false,
        render: {
          scss: true		// Activate Sass output (with default options)
        }
      },
      symbol: true		// Activate the «symbol» mode
    }
  };

  gulp.src('src/img/sprite/*.svg')
      .pipe(svgSprite(config))
      .pipe(flatten())
      .pipe(gulp.dest('src/img'))
});

gulp.task('svg:remove', ['svg:start'], function () {
  del([
    'src/img/svg'
  ]);
});

gulp.task('svg', ['svg:start','svg:remove']);

/*Script*/
gulp.task('script', function () {
  gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
      .pipe(uglify())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('src/js/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
/*Sass*/
gulp.task('sass', function () {
  return gulp.src('src/sass/style.scss')
      .pipe(plumber())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', '> 3%', 'ie 6-8'],
        cascade: false
      }))
      .pipe(gcmq())
      .pipe(gulp.dest('src/css/'))
      .pipe(cleanCSS({keepSpecialComments: 0}))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('src/css/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
/*Imagemin*/
gulp.task('imgmin', function () {
  return gulp.src(['src/img/**/*', '!src/img/sprite/**/*','!src/img/svg/**/*', '!src/img/view/**/*'])
      .pipe(imgmin())
      .pipe(gulp.dest('src/img/'));
});
/*Html*/
gulp.task('html', function () {
  gulp.src('src/*.html')
  //.pipe(htmlAutoprefixer())
      .pipe(gulp.dest('src/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

/*Start*/
gulp.task('start', ['script', 'sass', 'html', 'imgmin']);
/*Watch*/
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['script']);
  gulp.watch('src/**/*.html', ['html']);
});
/*Serv*/
gulp.task('serv', function () {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
});

/*Build*/
gulp.task('build:cleanfolder', function () {
  del([
    'build'
  ]);
});
gulp.task('build:copy', ['build:cleanfolder'], function () {
  return gulp.src('src/**/*/')
      .pipe(gulp.dest('build'));
});
gulp.task('build:remove', ['build:copy'], function () {
  del([
    'build/sass/',
    'build/_layout/',
    'build/template/',
    'build/img/sprite/',
    'build/img/svg/',
    'build/lib/'

  ]);
});

gulp.task('build', ['build:copy', 'build:remove']);


/*Default*/
gulp.task('default', ['start', 'serv', 'watch']);
