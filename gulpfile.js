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
var gulpCopy = require('gulp-file-copy');
var del = require('del');
var browserSync = require('browser-sync').create();
/*Script*/
gulp.task('script', function () {
    gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
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
    return gulp.src(['src/css/**/*.css', '!src/css/**/*min.css'])
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 3%','ie 6-8'],
            cascade: false
        }))
        .pipe(gcmq())
        .pipe(gulp.dest('src/css/'))
        .pipe(minifyCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('src/css/'))
});
/*Html*/
gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(htmlAutoprefixer())
        .pipe(gulp.dest('src/'))
});
/*Start*/
gulp.task('start', ['script', 'sass', 'css', 'html']);
/*Watch*/
gulp.task('watch', function () {
    gulp.watch('src/sass/style.scss', ['sass']);
    gulp.watch('src/css/**/*.css', ['css']);
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

/*Build*/
gulp.task('build:cleanfolder', function () {
    del([
        'build'
    ]);
});
gulp.task('build:copy',['build:cleanfolder'], function(){
    return gulp.src('src/**/*/')
        .pipe(gulp.dest('build'));
});
gulp.task('build:remove',['build:copy'], function () {
    del([
        'build/sass/',
        'build/_layout/',
        'build/template/'
    ]);
});

gulp.task('build', ['build:copy', 'build:remove']);


/*Default*/
gulp.task('default', ['start' ,'watch', 'serv']);
