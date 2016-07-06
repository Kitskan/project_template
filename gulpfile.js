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
    gulp.src('app/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/js/'))
});
/*Sass*/
gulp.task('sass', function () {
    return gulp.src('app/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(plumber())
        .pipe(gulp.dest('dist/css/'));
});
/*CSS*/
gulp.task('css', function() {
    return gulp.src('dist/css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 3%','ie 6-8'],
            cascade: false
        }))
        .pipe(gcmq())
        .pipe(gulp.dest('dist/css/'))
        .pipe(minifyCSS())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest('dist/css/'))
});
/*Html*/
gulp.task('html', function () {
    gulp.src('app/**/*.html')
        .pipe(htmlAutoprefixer())
        .pipe(gulp.dest('dist/'))
});
/*Build*/
gulp.task('build', ['script', 'sass', 'css', 'html']);
/*Watch*/
gulp.task('watch', function () {
    gulp.watch('app/sass/style.scss', ['sass']);
    gulp.watch('dist/css/style.css', ['css']);
    gulp.watch('app/js/**/*.js', ['script']);
    gulp.watch('dist/**/*.html', ['html']);
});
/*Serv*/
gulp.task('serv', function(){
  browserSync.init({
    server: 'dist'
  });
  browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});
gulp.task('default', ['build' ,'watch', 'serv']);
