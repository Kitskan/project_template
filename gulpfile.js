/*jslint node: true */
'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var htmlAutoprefixer = require("gulp-html-autoprefixer");
var csso = require('gulp-csso');
var rename = require("gulp-rename");
var gcmq = require('gulp-group-css-media-queries');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var imgmin = require('gulp-imagemin');
var del = require('del');
var browserSync = require('browser-sync').create();
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
   .pipe(sass().on('error', sass.logError))
   .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 3%', 'ie 6-8'],
      cascade: false
   }))
   .pipe(gcmq())
   .pipe(gulp.dest('src/css/'))
   .pipe(csso())
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
   return gulp.src(['src/img/**/*', '!src/img/sprite/**/*'])
   .pipe(imgmin())
   .pipe(gulp.dest('src/img/'));
});
/*Html*/
gulp.task('html', function () {
   gulp.src('src/*.html')
   .pipe(htmlAutoprefixer())
   .pipe(gulp.dest('src/'))
   .pipe(browserSync.reload({
      stream: true
   }));
});

/*Start*/
gulp.task('start', ['script', 'sass', 'html', 'imgmin']);
/*Watch*/
gulp.task('watch', function () {
   gulp.watch('src/sass/style.scss', ['sass']);
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
      'build/img/sprite/'
   ]);
});

gulp.task('build', ['build:copy', 'build:remove']);


/*Default*/
gulp.task('default', ['start', 'serv', 'watch']);
