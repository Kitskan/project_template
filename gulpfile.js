var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');


gulp.task('default', function() {
    return gulp.src('dist/css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS())
        
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('sass', function () {
    return gulp.src('app/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
    gulp.watch('app/sass/style.scss', ['sass']);
});