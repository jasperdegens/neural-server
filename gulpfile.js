'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');

gulp.task('sass', function(done){
  gulp.src('./sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('js', function(){
  gulp.src('./js/*.js')
      .pipe(uglify())
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('build', ['sass', 'js']);

gulp.task('sass:watch', function(){
  gulp.watch('./sass/*', ['sass']);
});
