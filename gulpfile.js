'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');

gulp.task('sass', function(done){
  gulp.src('./sass/*')
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('js', function(){
  gulp.src('js/*.js')
      .pipe(uglify())
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('js:dev', function(){
  gulp.src('./js/*.js')
      // .pipe(uglify())
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('build', ['sass', 'js']);

gulp.task('sass:watch', function(){
  gulp.watch('sass/*', ['sass']);
});

gulp.task('js:watch', function(){
  gulp.watch('./js/*', ['js:dev']);
});
