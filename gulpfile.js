
var gulp  = require('gulp')
  , gutil = require('gulp-util')
  , mocha = require('gulp-mocha')


gulp.task('default', function () {
  // place code for your default task here
})

gulp.task('test', function () {
  gulp
    .src('test/*.js')
    .pipe(mocha({reporter: 'min'}))
})

