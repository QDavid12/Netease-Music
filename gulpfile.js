'use strict';

var gulp = require('gulp');

var webpack = require('gulp-webpack');
var config = require('./webpack.config');

gulp.task('js', function () {
  gulp.src('./js')
    .pipe(webpack(config))
    .on('error', gutil.log) // 在这里捕捉编译错误
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', ['js']);
});

