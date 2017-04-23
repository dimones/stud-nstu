var gulp = require('gulp'),
    mini = require('gulp-minify-css'),
    concat = require('gulp-concat-css'),
	watch = require('gulp-watch');
  
gulp.task('minify', function () {
  gulp.src('static/css/forgulp/*.css')
      .pipe(concat('allstyles.css'))
      .pipe(mini())
      .pipe(gulp.dest('static/css'))
});
gulp.task('watch', function(){
    watch(['static/css/forgulp/*.css'], function(event, cb) {
        gulp.start('minify');
    });
});