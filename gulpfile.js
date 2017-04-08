var gulp = require('gulp'),
    mini = require('gulp-minify-css'),
    concat = require('gulp-concat-css');
  
gulp.task('minify', function () {
  gulp.src('static/css/forgulp/*.css')
      .pipe(concat('allstyles.css'))
      .pipe(mini())
      .pipe(gulp.dest('static/css'))
});