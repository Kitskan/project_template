'use strict'
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var htmlAutoprefixer = require( "gulp-html-autoprefixer");
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var gcmq = require('gulp-group-css-media-queries');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
/*Script*/
gulp.task('script', function () {
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('src/js/'))
});
/*Sass*/
gulp.task('sass', function () {
    return gulp.src('app/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(plumber())
        .pipe(gulp.dest('src/css/'));
});
/*CSS*/
gulp.task('css', function() {
    return gulp.src('src/css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 3%','ie 6-8'],
            cascade: false
        }))
        .pipe(gcmq())
        .pipe(gulp.dest('src/css/'))
        .pipe(minifyCSS())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest('src/css/'))
});
/*Html*/
gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(htmlAutoprefixer())
        .pipe(gulp.dest('src/'))
});
/*Build*/
gulp.task('build', ['script', 'sass', 'css', 'html']);
/*Watch*/
gulp.task('watch', function () {
    gulp.watch('src/sass/style.scss', ['sass']);
    gulp.watch('src/css/style.css', ['css']);
    gulp.watch('src/js/**/*.js', ['script']);
    gulp.watch('src/**/*.html', ['html']);
});
/*Serv*/
gulp.task('serv', function(){
  browserSync.init({
    server: 'src'
  });
  browserSync.watch('src/**/*.*').on('change', browserSync.reload);
});
gulp.task('default', ['build' ,'watch', 'serv']);
