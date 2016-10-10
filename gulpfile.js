'use strict';
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var gcmq = require('gulp-group-css-media-queries');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var imgmin = require('gulp-imagemin');
var del = require('del');
var flatten = require('gulp-flatten');
var browserSync = require('browser-sync').create();
var svgSymbols = require('gulp-svg-symbols');
var pcg = require('./package.json');
var path = {
  build: 'build/',
  pathDel: {
    build: 'build/**',
    layout: 'build/' + pcg.name + '/_layout/**',
    sprite: 'build/' + pcg.name + '/img/sprite/**',
    svg: 'build/' + pcg.name + '/img/svg/**',
    lib: 'build/' + pcg.name + '/lib/**',
    sass: 'build/' + pcg.name + '/sass/**',
    partials: 'build/' + pcg.name + '/js/partials/**'
  }
};


gulp.task('log', function () {
  console.log(path.pathDel.layout);
});
//Sprite task
gulp.task('svg', function () {
  return gulp.src('src/img/sprite/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('src/img'));
});

/*Script*/
gulp.task('script', function () {
  gulp.src([
    /*Default settings*/
    //'src/js/partials/**/*.js',
    //'!src/js/partials/**/*.min.js'

    'src/js/partials/script.js'
  ])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('src/js/'))
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
  return gulp.src('src/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 3%', 'ie 10'],
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
  return gulp.src(['src/img/**/*', '!src/img/sprite/**/*'])
    .pipe(imgmin())
    .pipe(gulp.dest('src/img/'));
});
/*Html*/
gulp.task('html', function () {
  gulp.src('src/*.html')
    .pipe(plumber())
    //.pipe(htmlAutoprefixer())
    //.pipe(gulp.dest('src/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/*Start*/
gulp.task('start', ['script', 'sass', 'html', 'imgmin']);
/*Watch*/
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/partials/**/*.js', ['script']);
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
gulp.task('build:del', function () {
  return del([path.pathDel.build])
});
gulp.task('build:copy',function () {
  return gulp.src('src/**/*/')
    .pipe(gulp.dest(path.build + pcg.name))
});
gulp.task('build:clean',function () {
  del([
    path.pathDel.layout,
    path.pathDel.sprite,
    path.pathDel.svg,
    path.pathDel.lib,
    path.pathDel.sass,
    path.pathDel.partials
  ]);

});
gulp.task('build', gulpsync.sync(['build:del','build:copy','build:clean']));

/*Default*/
gulp.task('default', ['start', 'serv', 'watch']);
